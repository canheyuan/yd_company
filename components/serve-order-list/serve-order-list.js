const app = getApp(); //获取应用实例
const commonFn = require('../../utils/common.js'); //一些通用的函数
const listFn = require('../../utils/list.js'); //通用列表函数

Component({
    //组件的属性列表
    properties: {
        targetPage: String,
        tagType: {
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({ tagType: newVal });
            }
        },
        reachData: {
            type: Number,
            observer: function (newVal, oldVal, changedPath) {
                if (this.data.isFirst) {
                    this.setData({ isFirst: false })
                }
                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal > 1) {
                    this.setData({ ['listInfo.pageNum']: 1 });
                };
                //this.loadMoreListFn();
            }
        }
    },

    //组件的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        tagType: '',    //类型
        isFirst: true,

        handleType: '',  //操作类型
        popData: {
            show: true, //弹窗是否显示
            title: '服务完成',  //标题
            des: '感谢您对我们的支持！\n本次服务已经完成？',  //提示文字
            tipText: '已完成',
            callOffFnName: 'closeTipPop',   //取消函数名
            confirmFnName: 'handleFn',  //确定函数名
        },   //弹窗里当前的数据
        tipPopData: {
            approve: {
                show: true, //弹窗是否显示
                title: '服务完成',  //标题
                des: '感谢您对我们的支持！\n本次服务已经完成？',  //提示文字
                tipText: '已完成',
                callOffFnName: 'closeTipPop',   //取消函数名
                confirmFnName: 'handleFn',  //确定函数名
            },
            reject: {
                show: true,
                title: '撤回申请',
                des: '感谢您对我们的支持！\n是否撤回取消服务的申请？',
                tipText: '已撤回',
                callOffFnName: 'closeTipPop',
                confirmFnName: 'handleFn',
            },
        },  //弹窗数据
        starScore:3,    //星星评分


        listInfo: {
            list:[1,2,3,4,5,6]
        },   //列表数据
    },

    //组件的方法列表
    methods: {
        //获取列表
        getListInfo(isReach){
            var _this = this;
            var c_status = this.properties.tagType;
            listFn.listPage({
                url: `/estateComplaint/list`,
                data: {
                    status: c_status   //1-待处理 2-处理中 3-已完成
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
                        
                    }
                    return listItem;
                },
                success: () => {
                    console.log("投诉建议列表接口：", _this.data.listInfo);
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

        //评分星星
        starChangeFn(e) {
            var star = e.currentTarget.dataset.star;
            this.setData({
                starScore: star
            });
        },

        //打开提示弹窗
        openTipPop(e) {
            var handleType = e.currentTarget.dataset.type;
            var popData = this.data.tipPopData[handleType];
            this.setData({
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
            var apiUrl = '';
            if (!handleType) { return; }
            switch (handleType) {
                case 'approve': //审核通过
                    apiUrl = `/manage/bill/approve/${orderId}`
                    break;
                case 'reject':  //审核拒绝
                    apiUrl = `/manage/bill/reject/${orderId}`
                    break;
                case 'ignore':    //忽略异常
                    apiUrl = `/manage/bill/ignore/${orderId}`
                    break;
                case 'generate':    //重新生成
                    apiUrl = `/manage/bill/generate/${orderId}`
                    break;
            }

            app.requestFn({
                url: apiUrl,
                method: 'POST',
                success: (res) => {
                    app.globalData.feeReach = true;
                    wx.showToast({ title: _this.data.popData.tipText, icon: 'success', duration: 2000 });
                    _this.closeTipPop();
                    setTimeout(() => {
                        _this.getFeeDetail(orderId);
                    }, 1500)
                }
            });
        },
    }
})
