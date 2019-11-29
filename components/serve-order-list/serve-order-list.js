const app = getApp(); //获取应用实例
const commonFn = require('../../utils/common.js'); //一些通用的函数
const listFn = require('../../utils/list.js'); //通用列表函数

Component({
    //组件的属性列表
    properties: {
        targetPage: String,
        tagType: String,    //状态类型
        reachData: {
            type: Number,
            observer: function (newVal, oldVal, changedPath) {
                if (this.data.isFirst) {
                    this.setData({ isFirst: false })
                    //设置语言,判断是否切换语言
                    app.loadLangNewFn(this, 'serve',(res,lang)=>{
                        this.setData({
                            tipPopData: {
                                finish: {   //服务完成
                                    show: true, //弹窗是否显示
                                    title: res.tipPopData.finish.title[lang],  //标题
                                    des: res.tipPopData.finish.des[lang],  //提示文字
                                    tipText: res.tipPopData.finish.tipText[lang],
                                    isScore: false,  //是否评分
                                    callOffFnName: 'closeTipPop',   //取消函数名
                                    confirmFnName: 'handleFn',  //确定函数名
                                },
                                evaluation: { //服务评价
                                    show: true,
                                    title: res.tipPopData.evaluation.title[lang],
                                    des: res.tipPopData.evaluation.des[lang],
                                    tipText: res.tipPopData.evaluation.tipText[lang],
                                    isScore: true,
                                    callOffFnName: 'closeTipPop',
                                    confirmFnName: 'handleFn',
                                }

                            }
                        })
                    });
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
        domainUrl: app.globalData.domainUrl,
        isFirst: true,

        handleType: '',  //操作类型
        popData: null,   //当前弹窗里的数据
        orderId:'',
        tipPopData: null,  //弹窗数据
        starScore:0,    //星星评分
        listInfo: {},   //列表数据

        langData:null,
        lang:''
    },

    //组件的方法列表
    methods: {
        //获取列表
        getListInfo(isReach){
            var _this = this;
            var cType = this.properties.tagType;
            var langData = this.data.langData
            var lang = this.data.lang
            listFn.listPage({
                url: `/serviceOrder/list`,
                data: {
                    status: cType   //订单状态（全部-不填 1-待确认 2-待交付 3-待验收 4-待评价 5-已评价 6-已取消）
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
                        switch (listItem.status){
                            case 1:
                                listItem.statusName = langData.orderStatus01[lang]
                                listItem.statusClass = 's_bg01'
                                break;
                            case 2:
                                listItem.statusName = langData.orderStatus02[lang]
                                listItem.statusClass = 's_bg01'
                                break;
                            case 3:
                                listItem.statusName = langData.orderStatus03[lang]
                                listItem.statusClass = 's_bg02'
                                break;
                            case 4:
                                listItem.statusName = langData.orderStatus04[lang]
                                listItem.statusClass = 's_bg04'
                                break;
                            case 5:
                                listItem.statusName = langData.orderStatus05[lang]
                                listItem.statusClass = 's_bg03'
                                break;
                            case 6:
                                listItem.statusName = langData.orderStatus06[lang]
                                listItem.statusClass = 's_bg05'
                                break;
                        }
                        listItem.star = listItem.star ? parseInt(listItem.star):null
                    }
                    return listItem;
                },
                success: () => {
                    console.log("我的服务订单列表：", _this.data.listInfo);
                }
            });
        },


        //上拉到底部加载更多函数
        loadMoreListFn() {
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
        gotoDetailFn(e){
            var id = e.currentTarget.dataset.id;
            wx.navigateTo({ url: `/pages/services/serve-order-detail/serve-order-detail?id=${id}` })
        },

        //评分星星
        starChangeFn(e) {
            var star = e.currentTarget.dataset.star;
            this.setData({ starScore: star });
        },

        //打开提示弹窗
        openTipPop(e) {
            var handleType = e.currentTarget.dataset.type
            var orderId = e.currentTarget.dataset.id    //服务id
            var popData = this.data.tipPopData[handleType]
            console.log('打开提示弹窗:', handleType, popData)
            this.setData({
                orderId: orderId,
                handleType: handleType,
                popData: popData
            })
        },

        //关闭弹窗
        closeTipPop() {
            this.setData({ popData: {} })
        },

        //操作
        handleFn(e) {
            var _this = this;
            var orderId = this.data.orderId;
            var handleType = this.data.handleType;
            var formData = {};
            var apiUrl = '';
            if (!handleType) { return; }
            switch (handleType) {
                case 'finish': //服务完成
                    apiUrl = `/serviceOrder/check/${orderId}`
                    var jsonType = 'application/json'
                    break;
                case 'evaluation':    //服务评价
                    apiUrl = `/serviceOrder/star/${orderId}`
                    formData['star'] = this.data.starScore;
                    var jsonType = 'application/x-www-form-urlencoded'
                    break;
            }
            console.log('apiUrl:', apiUrl, 'formData:', formData);
            //return;
            app.requestFn({
                url: apiUrl,
                method: 'POST',
                data:formData,
                header:'application/x-www-form-urlencoded',
                success: (res) => {
                    wx.showToast({ title: _this.data.popData.tipText, icon: 'success', duration: 2000 });
                    _this.closeTipPop();
                    setTimeout(() => {
                        _this.setData({ ['listInfo.pageNum']: 1 });
                        _this.loadMoreListFn();
                    }, 1500)
                }
            });
        },

        
    }
})
