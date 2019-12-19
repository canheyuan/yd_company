const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        lang: '',    //语言类型

        detailData:null,    //详情数据
        orderId:'', //订单id

        handleType: '',  //操作类型
        popData: null,   //当前弹窗里的数据
        tipPopData: null,  //弹窗数据
        starScore: 0,    //星星评分

    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.orderDetailTitle[lang] });  //设置当前页面的title
            this.setData({
                orderId: options.id,
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
            this.getDetailFn(options.id)
        });

    },

    //生命周期函数--监听页面显示
    onShow: function () {
        if (app.globalData.serveOrderReach) {
            this.getDetailFn(this.data.orderId);
        }
    },

    //获取详情
    getDetailFn(id) {
        var _this = this;
        var langData = this.data.langData
        var lang = this.data.lang
        app.requestFn({
            url: `/serviceOrder/detail/${id}`,
            success: (res) => {
                console.log('服务详情：', res.data)
                var detailData = res.data.data;
                switch (detailData.status) {
                    case 1:
                        detailData.statusName = langData.orderStatus01[lang]
                        detailData.statusClass = 's_bg01'
                        break;
                    case 2:
                        detailData.statusName = langData.orderStatus02[lang]
                        detailData.statusClass = 's_bg01'
                        break;
                    case 3:
                        detailData.statusName = langData.orderStatus03[lang]
                        detailData.statusClass = 's_bg02'
                        break;
                    case 4:
                        detailData.statusName = langData.orderStatus04[lang]
                        detailData.statusClass = 's_bg04'
                        break;
                    case 5:
                        detailData.statusName = langData.orderStatus05[lang]
                        detailData.statusClass = 's_bg03'
                        break;
                    case 6:
                        detailData.statusName = langData.orderStatus06[lang]
                        detailData.statusClass = 's_bg05'
                        break;
                }
                detailData.star = detailData.star?parseInt(detailData.star):null;
                this.setData({ detailData: detailData });
            }
        })
    },

    //评分星星
    starChangeFn(e) {
        var star = e.currentTarget.dataset.star;
        this.setData({ starScore: star });
    },

    //打开提示弹窗
    openTipPop(e) {
        var handleType = e.currentTarget.dataset.type
        var popData = this.data.tipPopData[handleType]
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
        //return;
        app.requestFn({
            url: apiUrl,
            method: 'POST',
            data: formData,
            header: 'application/x-www-form-urlencoded',
            success: (res) => {
                //app.globalData.feeReach = true;
                wx.showToast({ title: _this.data.popData.tipText, icon: 'success', duration: 2000 });
                _this.closeTipPop();
                setTimeout(() => {
                    _this.setData({ ['listInfo.pageNum']: 1 });
                    _this.getDetailFn(_this.data.orderId);
                }, 1500)
            }
        });
    },


    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {
        this.getDetailFn(this.data.orderId)
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },
})