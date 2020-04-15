const app = getApp();  //获取应用实例
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        monthlyId:'',   //月保id
        periodCount:1,  //月保周期数
        renewInfo:null, //月保续费信息
        periodMonth:'',   //月保一周期几个月
    },

    onLoad: function (options) {
        this.setData({ monthlyId : options.id })
        //this.setData({ monthlyId : '950e521f537297bc639526263f7ab199' })
        this.getRenewInfo();
    },

    //获取月保续费信息
    getRenewInfo(){
        app.requestFn({
            isLoading:false,
            url: `/parkingMonthly/renewInfo`,
            data:{
                monthlyId : this.data.monthlyId,
                periodCount :this.data.periodCount
            },
            success: (res) => {
                //console.log('获取月保续费信息:',res.data)
                var renewInfo = res.data.data
                this.setData({ renewInfo : renewInfo})
                if(!this.data.periodMonth){
                    this.setData({ periodMonth : parseInt(renewInfo.monthCount/renewInfo.periodCount) })
                }
            }
        });
    },

    //改变周期数量
    changeNumFn(e){
        var type = e.currentTarget.dataset.type
        var periodCount = this.data.periodCount
        periodCount = (type == 'add') ? periodCount + 1 : (periodCount == 1 ? 1 : periodCount - 1)
        this.setData({ periodCount: periodCount })
        this.getRenewInfo()
    },

    //立即支付
    formSubmit(e) {
        var _this = this;
        var formId = e.detail.formId
        var monthlyId = this.data.monthlyId
        var periodCount = this.data.periodCount
        var openId = app.globalData.openId ? app.globalData.openId : ''
        var formData = {
            openId : openId,
            periodCount : periodCount
        }
        app.getFormIdFn(formId, () => {
            //提交注册数据
            app.requestFn({
                loadTitle: '提交中...',
                url: `/parkingMonthly/topay/${monthlyId}`,
                header: 'application/x-www-form-urlencoded',
                data: formData,
                method: 'POST',
                success: (res) => {
                    console.log('提交生成微信账单')
                    var payData = res.data.data 
                    app.wxPayFn(payData, function (e) {
                        //成功或失败返回的函数,e是提示状态requestPayment：ok(成功)，:fail cancel(取消支付)，fail (detail message)(支付失败)
                        if (e.errMsg == 'requestPayment:ok') {
                            console.log('调用支付完成');
                            app.globalData.enquiryReach = true
                            wx.redirectTo({ url: '/pages/common/result/result?page=parkingRoder' });
                        } else if (e.errMsg == 'requestPayment:fail cancel') {
                            console.log('取消支付');
                        } else if (e.errMsg == 'requestPayment:fail (detail message)') {
                            wx.showToast({ title: '支付失败！', icon: 'none', duration: 3000 });
                        }

                    });
                }
            });
        })
    }

})