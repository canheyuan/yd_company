const app = getApp(); //获取应用实例
const listFn = require('../../utils/list.js'); //通用列表函数

Component({

    properties: {
        targetPage: String,

        reachData: {    
            type: Number,
            observer: function (newVal, oldVal, changedPath) {
                if (this.data.isFirst) {
                    this.setData({ isFirst: false })
                    app.loadLangFn(this, 'cpBacklog');
                }
                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal > 1) {
                    this.setData({ ['listInfo.pageNum']: 1 });
                };
                this.loadMoreListFn();
            }
        }
    },

    data: {
        domainUrl: app.globalData.domainUrl,    //图片地址前缀
        listInfo:{},
        isFirst:true,
        langData: null,  //语言数据
        langType:''
    },

    //组件加载完成后
    attached() {
        // //设置语言,判断是否切换语言
        // app.loadLangFn(this, 'cpBacklog');
    },

    methods: {
        //获取列表数据
        getListInfo(isReach) {
            var _this = this;
            var langData = this.data.langData;
            var langType = this.data.langType;
            if (this.properties.targetPage=='index'){   //若是首页的待办，只显示前五条
                this.setData({ ['listInfo.pageSize']:5 })
            }
            listFn.listPage({
                url: `/userBacklog/list`,
                isReach: isReach,
                page: _this,
                listDataName: 'listInfo',
                getListDataFn: (listdata) => {
                    //返回列表数据和总数
                    return {
                        list: listdata.data.rows,
                        total: listdata.data.total
                    }
                },
                disposeFn: (listItem) => {
                    //对列表循环操作改变数据
                    var listItem = listItem;
                    if (listItem) {
                        listItem.time = listItem.updateTime.substr(11, 5);
                        listItem.date = listItem.updateTime.substr(5, 5);
                        switch (listItem.entityType){
                            case 'estaterepair':    //报修
                                listItem.className = 'li_yellow';
                                listItem.labelName = langData.repairText;
                                listItem.goUrl = '/pages/repair/repair-detail/repair-detail?id=' + listItem.entityId
                                break;
                            case 'financebill': //订单
                                listItem.className = 'li_blue';
                                listItem.labelName = langData.billText;
                                listItem.goUrl = '/pages/order/confirmation-info/confirmation-info?id=' + listItem.entityId
                                break;
                            case 'estaterentdetail':    //物资
                                listItem.className = 'li_green';
                                listItem.labelName = langData.goodsText;
                                listItem.goUrl = '/pages/supplies/supplies-detail/supplies-detail?id=' + listItem.entityId
                                break;
                            case 'estatedecorationbooking': //装修
                                listItem.className = 'li_purple';
                                listItem.labelName = langData.fixturesText;
                                listItem.goUrl = '';
                                break;
                            case 'chamberorder':    //场地预定
                                listItem.className = 'li_purple';
                                listItem.labelName = langData.billText;
                                listItem.goUrl = '/pages/user/my-reserve-details/my-reserve-details?id=' + listItem.entityId
                                break;
                        }
                    }
                    return listItem;
                },
                success: (res) => {
                    console.log("待办事项列表：", _this.data.listInfo);
                    this.triggerEvent('getTotalFn', { total: _this.data.listInfo.pageTotal});
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

        //跳转代办事项
        goToBackLog(e) {
            var langData = this.data.langData;
            var goUrl = e.currentTarget.dataset.url;
            if (!goUrl) {
                wx.showToast({ title: langData.buildTip, icon: 'none', duration: 2000 });
            } else {
                wx.navigateTo({ url: goUrl });
            }

        }
    }
})
