const app = getApp(); //获取应用实例
const commonFn = require('../../utils/common.js');
Page({

    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null,
        reserveId: '',

        langData: null,  //语言数据
        lang: '',    //语言类型

    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'visitor', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.visitorAppointmentTitle[lang] });  //设置当前页面的title
        });

        this.setData({ reserveId: options.id });
        this.getDetailFn(options.id);
    },

    //通过
    passFn(e) {
        app.requestFn({
            url: `/visitorReservation/scan/${this.data.reserveId}`,
            header: 'application/x-www-form-urlencoded',
            method: "POST",
            success: (res) => {
                console.log("通过", res);
                wx.navigateTo({ url: '/visitor/scan-success/scan-success' }); //跳转成功页
            },
            fail: (res) => {
                console.log('fail', res);
            }
        });
    },

    //获取详情信息
    getDetailFn(id) {
        var langData = this.data.langData
        var lang = this.data.lang
        app.requestFn({
            url: `/visitorReservation/detail/${id}`,
            success: (res) => {
                var detailData = res.data.data;
                switch (detailData.status) {
                    case 1:
                        detailData.statusName = langData.statusText1[lang];
                        break;
                    case 2:
                        detailData.statusName = langData.statusText2[lang];
                        break;
                    case 3:
                        detailData.statusName = langData.statusText3[lang];
                        break;
                    default:
                        detailData.statusName = langData.statusText4[lang];
                        break;
                }

                detailData.arriveTime = detailData.arriveTime ? commonFn.getDate(detailData.arriveTime).substring(0, 16) : null;  //到访时间
                detailData.leaveTime = detailData.leaveTime ? commonFn.getDate(detailData.leaveTime).substring(0, 16) : null; //离开时间
                detailData.reserveTime = detailData.reserveTime ? commonFn.getDate(detailData.reserveTime).substring(0, 16) : null; //预约时间
                detailData.createTime = detailData.createTime ? commonFn.getDate(detailData.createTime).substring(0, 16) : null; //预约时间

                this.setData({ detailsData: detailData });

            }
        });
    }

})