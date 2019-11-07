const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型

        handleType: '',  //操作类型
        popData: null,   //当前弹窗里的数据
        tipPopData: {
            finish: {   //服务完成
                show: true, //弹窗是否显示
                title: '服务完成',  //标题
                des: '感谢您对我们的支持！\n本次服务已经完成？',  //提示文字
                tipText: '已完成',
                isScore: false,  //是否评分
                callOffFnName: 'closeTipPop',   //取消函数名
                confirmFnName: 'handleFn',  //确定函数名
            },
            withdraw: { //撤回申请
                show: true,
                title: '撤回申请',
                des: '感谢您对我们的支持！\n是否撤回取消服务的申请？',
                tipText: '已撤回',
                isScore: false,
                callOffFnName: 'closeTipPop',
                confirmFnName: 'handleFn',
            },
            evaluation: { //服务评价
                show: true,
                title: '服务评价',
                des: '请为我们的服务评分！',
                tipText: '已评分',
                isScore: true,
                callOffFnName: 'closeTipPop',
                confirmFnName: 'handleFn',
            }

        },  //弹窗数据
        starScore: 0,    //星星评分

    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'services', (res) => {
            //wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    //打开提示弹窗
    openTipPop(e) {
        var handleType = e.currentTarget.dataset.type;
        var popData = this.data.tipPopData[handleType];
        console.log('打开提示弹窗:', handleType, popData)
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
            case 'finish': //服务完成
                apiUrl = `${orderId}`
                break;
            case 'withdraw':  //撤回申请
                apiUrl = `${orderId}`
                break;
            case 'evaluation':    //服务评价
                apiUrl = `${orderId}`
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
                    _this.setData({ ['listInfo.pageNum']: 1 });
                    _this.loadMoreListFn();
                }, 1500)
            }
        });
    },



    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {

    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {

    },

    //用户点击右上角分享
    onShareAppMessage: function () {

    }
})