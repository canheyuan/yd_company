const app = getApp(); //获取应用实例
const commonFn = require('../../utils/common.js');
const listFn = require('../../utils/list.js'); //通用列表函数

Component({
    //组件的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        listName: '',  //搜藏页面添加的class
        policyType: '',  //接口数据类型
        targetName: "policy", //当前页面
        listInfo: {},   //列表数据

        isFirst:true,
        langData: null,  //语言数据
        lang: ''
    },

    //组件的属性列表
    properties: {
        targetPage: String,

        //改变类型列表
        policyType: {
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({ policyType: newVal }); //改变列表数据
            }
        },

        //刷新数据
        reachData: {
            type: Number, // 类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {
                if (this.data.isFirst) {
                    this.setData({ isFirst: false })
                    app.loadLangNewFn(this, 'cpPolicyList');
                }
                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal > 1) {
                    this.setData({ ['listInfo.pageNum']: 1 });
                };
                this.loadMoreListFn();
            }
        }
    },

    //组件加载完成后
    attached() {
        //搜藏页才需要加类collect
        if (this.properties.targetPage == "collect") {
            this.setData({
                targetName: 'policy_collect',
                listName: 'collect'
            });
        }
    },

    //组件的方法列表
    methods: {

        //跳转到详情页
        gotoDetailsFn(e) {
            var pId = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/found/policy-detail/policy-detail?id=' + pId,
            });
        },

        //获取列表数据
        getListInfo(isReach) {
            var _this = this;
            var url = '/policy/list';//默认列表
            if (this.data.policyType == 'recommend') {
                url = '/policy/recommendList'; //推荐列表
            } else if (this.properties.targetPage == "collect") {
                url = '/policyCollection/policyList';//收藏列表
            }
            listFn.listPage({
                isLoading:false,
                url: url,
                data: {
                    indTypeKey: _this.data.policyType
                },
                isReach: isReach,
                page: _this,
                listDataName: 'listInfo',
                getListDataFn: (listdata) => {
                    //返回列表数据和总数
                    return {
                        list: listdata.rows,
                        total: listdata.total
                    }
                },
                disposeFn: (listItem) => {
                    //对列表循环操作改变数据
                    var listItem = listItem;
                    if (listItem) {

                        listItem.endTime = commonFn.getDate(listItem.endTime);
                        if (listItem.highestReward >= 10000 && _this.data.lang=='zh') {
                          listItem.highestReward = parseInt(listItem.highestReward / 10000) + '万';
                        }

                        if (listItem.highestReward >= 1000000 && _this.data.lang == 'en') {
                            listItem.highestReward = parseInt(listItem.highestReward / 1000000) + ' million';
                        }

                    }
                    return listItem;
                },
                success: (res) => {
                    console.log("政策接口：", _this.data.listInfo);
                    if (_this.data.policyType == 'recommend') {
                        //为你推荐把总数传递到页面中
                        _this.triggerEvent('recommendTotal', _this.data.listInfo.pageTotal);
                    }
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
        },

        //图片加载失败显示默认图
        errorImgFn(e) {
            //有三个参数：当前页面this，要替换的对象，替换图片地址
            commonFn.errorImg(this, e.currentTarget.dataset.obj);
        },

        //打开弹窗
        collectPopShow(e) {
            this.triggerEvent('collectPopShow', { type: 'policy', id: e.currentTarget.dataset.id });
        }

    }
})
