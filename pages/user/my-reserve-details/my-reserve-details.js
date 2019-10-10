
const app = getApp();   //获取应用实例
const commonFn = require('../../../utils/common.js');   //一些通用的函数
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        isIndexBtnShow:false,   //返回首页按钮是否显示
        detailData: null,   //详情信息

        langData: null,
        langType: ''
    },

    onLoad: function (options) {
        if (options.from == 'ma_msg') {
            this.setData({ isIndexBtnShow: true });
        }
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'reserve', (res) => {
            wx.setNavigationBarTitle({ title: res.myReserveTitle });  //设置当前页面的title
            this.getDetailsFn(options.id);
        });

    },

    //获取详情页数据
    getDetailsFn(id) {
        var langData = this.data.langData;
        app.requestFn({
            url: `/chamber/orderDetail/${id}`,
            success: (res) => {
                var detailData = res.data.data;
                detailData.order.startTime = commonFn.getDate(detailData.order.orderStart);
                detailData.order.endTime = commonFn.getDate(detailData.order.orderEnd);
                detailData.order.payTime = detailData.order.payTime ? commonFn.getDate(detailData.order.payTime):null;
                switch (detailData.order.status) {
                    case 1:
                        detailData.order.statusClass = 'l_yellow';
                        detailData.order.statusName = langData.labelName1;
                        break;
                    case 2:
                        if (detailData.order.payStatus == 1) {
                            detailData.order.statusClass = 'l_blue';
                            detailData.order.statusName = langData.labelName2;
                        } else {
                            detailData.order.statusClass = 'l_gray';
                            detailData.order.statusName = langData.labelName3;
                        }
                        break;
                    case 3:
                        detailData.order.statusClass = 'l_gray';
                        detailData.order.statusName = langData.labelName4;
                        break;
                    case 9:
                        detailData.order.statusClass = 'l_yellow';
                        detailData.order.statusName = langData.labelName9;
                        break;
                }

                //设置data数据
                this.setData({ detailData: detailData });
            }
        });
    },

    //创建支付订单
    createOrderFn(e) {
        var orderId = this.data.detailData.order.id;
        var openId = app.globalData.openId;
        var formId = e.detail.formId;
        app.getFormIdFn(formId, () => {
            app.requestFn({
                url: `/chamber/topay/${orderId}`,
                header: 'application/x-www-form-urlencoded',
                method: 'POST',
                data: {
                    openId: openId
                },
                success: (res) => {
                    console.log('创建订单成功', res.data);
                    var payData = res.data.data;
                    app.wxPayFn(payData, function (e) {
                        //成功或失败返回的函数,e是提示状态requestPayment：ok(成功)，:fail cancel(取消支付)，fail (detail message)(支付失败)
                        if (e.errMsg == 'requestPayment:ok') {
                            console.log('调用支付完成');
                            wx.redirectTo({ url: '/pages/common/result/result?page=pay_venue' });
                        } else if (e.errMsg == 'requestPayment:fail cancel') {
                            console.log('取消支付');
                        } else if (e.errMsg == 'requestPayment:fail (detail message)') {
                            wx.showToast({ title: '支付失败！', icon: 'none', duration: 3000 });
                        }

                    });
                }
            })
        })
        
    }
})