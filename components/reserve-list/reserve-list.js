
const app = getApp(); //获取应用实例
const listFn = require('../../utils/list.js'); //通用列表函数
const commonFn = require('../../utils/common.js');  //一些通用的函数
Component({
    //组件的属性列表
    properties: {
        targetPage: String,

        reserveType: {
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({ reserveType: newVal });
                //this.getListInfo(1, newVal);    //改变列表数据
            }
        },

        reachData: {
            type: Number, //类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {
                if (this.data.isFirst) {
                    this.setData({ isFirst: false })
                    app.loadLangNewFn(this, 'cpReserveList');
                }
                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal > 1) {
                    this.setData({ ['listInfo.pageNum']: 1 });
                };
                this.loadMoreListFn();
            }
        }
    },

    //组件的初始数据
    data: {
        reserveType: '',  //接口数据类型
        listInfo: {},   //列表数据

        isFirst:true,
        langData: null,
    },

    //组件的方法列表
    methods: {

        //获取列表数据
        getListInfo(isReach) {
            var _this = this;
            var langData = this.data.langData
            var lang = this.data.lang

            listFn.listPage({
                url: '/chamber/myOrder',
                data: {
                    type: _this.data.reserveType,  //预定类型：0所有 1待确认 2已确认 3已过期，默认0
                },
                isReach: isReach,
                page: _this,
                listDataName: 'listInfo',
                getListDataFn: (listdata) => {
                    //返回列表数据和总数
                    return {
                        list: listdata.data,
                        total: listdata.total
                    }
                },
                disposeFn: (listItem) => {
                    //对列表循环操作改变数据
                    var listItem = listItem;
                    if (listItem) {
                        
                        listItem.rType = _this.data.reserveType;
                        listItem.reserveTime =  commonFn.getDate(listItem.orderStart).substring(0, 16) + 
                                                ' ' + langData.public.toText[lang] + ' ' + 
                                                commonFn.getDate(listItem.orderEnd).substring(11, 16);

                        switch (listItem.rType) {
                            case '1':
                                listItem.statusClass = 'l_yellow';
                                listItem.statusName = langData.labelName1[lang];
                                break;
                            case '2':
                                if(listItem.payStatus == 1){
                                    listItem.statusClass = 'l_blue';
                                    listItem.statusName = langData.labelName2[lang];
                                }else{
                                    listItem.statusClass = 'l_gray';
                                    listItem.statusName = langData.labelName3[lang];
                                }
                                break;
                            case '3':
                                listItem.statusClass = 'l_gray';
                                listItem.statusName = langData.labelName4[lang];
                                break;
                        }

                    }
                    return listItem;
                },
                success: () => {
                    console.log("场地预定列表接口：", _this.data.listInfo);
                }

            });
        },

        //上拉到底部加载更多函数
        loadMoreListFn: function () {
            var _this = this;
            var listInfo = this.data.listInfo;
            listFn.listLoadMore({
                pageNum: listInfo.pageNum,
                pageSize: listInfo.pageSize,
                pageTotal: listInfo.pageTotal,
                getListFn: (isReach) => {
                    _this.getListInfo(isReach);
                }
            })
        }

    }
})
