const app = getApp(); //获取应用实例
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        userInfo: null,
        detailsData: null,     //详情数据

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'order', (res) => {
            wx.setNavigationBarTitle({ title: res.confirInfoTitle });  //设置当前页面的title
        });

        this.getDetaisFn(options.id);
        //this.getDetaisFn('51adeef3003f6dfa64316f0dcaef4e64');
        if (app.globalData.loginInfo) {
            this.setData({ userInfo: app.globalData.loginInfo.userInfo });
        }
    },

    //获取详情信息
    getDetaisFn(id) {
        var _this = this;
        app.requestFn({
            url: `/bill/detail/${id}`,
            success: (res) => {
                console.log("缴费详情：", res.data.data);
                var data = res.data.data;
                data.month = data.feePeriod.substring(5, 7);
                this.setData({ detailsData: data });
            }
        });
    },

    //支付
    payFn(e) {
        var openId = app.globalData.openId;   //清除之前缓存
        app.requestFn({
            url: `/bill/topay/${this.data.detailsData.billId}`,
            header: 'application/x-www-form-urlencoded',
            data: {
                openId: openId
            },
            method: 'POST',
            success: (res) => {
                console.log("支付字段信息：", res.data.data);
                var payData = res.data.data;
                app.wxPayFn(payData, function (e) {

                    //成功或失败返回的函数,e是提示状态requestPayment：ok(成功)，:fail cancel(取消支付)，fail (detail message)(支付失败)
                    if (e.errMsg == 'requestPayment:ok') {
                        console.log('调用支付完成');
                        wx.redirectTo({ url: '/pages/common/result/result?page=pay' });
                    } else if (e.errMsg == 'requestPayment:fail cancel') {
                        console.log('取消支付');
                    } else if (e.errMsg == 'requestPayment:fail (detail message)') {
                        wx.showToast({ title: '支付失败！', icon: 'none', duration: 3000 });
                    }

                });
            }
        });
    }
})