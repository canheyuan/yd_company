const app = getApp(); //获取应用实例
const commonFn = require('../../utils/common.js');  //一些通用的函数
const listFn = require('../../utils/list.js'); //通用列表函数
Component({
    /**-------- 组件的属性列表 ---------**/
    properties: {
        targetPage: String,

        listType: String,

        reachData: {
            type: Number, // 类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {

                if (this.data.isFirst) {
                    this.setData({ isFirst: false })
                    app.loadLangNewFn(this, 'order');
                }

                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal > 1) {
                    this.setData({ ['listInfo.pageNum']: 1 });
                };
                this.loadMoreListFn();
            }
        }
    },

    /**-------- 组件的初始数据 ---------**/
    data: {
        domainUrl: app.globalData.domainUrl,
        isFirst:true,
        listInfo: {},
        period: '',

        langData: null,  //语言数据
    },

    //组件加载完成后
    attached() {

        //this.getListInfo(true)
    },

    //组件的方法列表
    methods: {

        //获取列表数据
        getListInfo(isReach) {
            var _this = this;

            listFn.listPage({
                url: `/bill/myBill`,
                data: {
                    type: _this.properties.listType,  //类型，0所有 1待支付 2未开票，默认0
                    period: _this.data.period  //收费周期 yyyy-MM
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

                        listItem.month = listItem.feePeriod.substring(5, 7);

                    }
                    return listItem;
                },
                success: () => {
                    console.log("订单列表接口：", _this.data.listInfo);
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

        //跳转到详情页
        gotoDetailsFn(e) {
            var id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/order/confirmation-info/confirmation-info?id=' + id
            });
        },


    }
})