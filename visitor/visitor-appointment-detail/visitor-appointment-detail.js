

const app = getApp(); //获取应用实例
const commonFn = require('../../utils/common.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null,

        langData: null,  //语言数据
        langType: '',    //语言类型

    },

    //生命周期函数--监听页面加载/
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'visitor', (res) => {
            wx.setNavigationBarTitle({ title: res.visitorAppointmentTitle });  //设置当前页面的title
        });

        this.getDetailFn(options.id);
        //this.getDetailFn('d50d355adb6ebf586137df2ad46eed54');
    },

    //获取详情信息
    getDetailFn(id) {
        var langData = this.data.langData;
        var that = this;
        app.requestFn({
            url: `/visitorReservation/detail/${id}`,
            success: (res) => {
                var detailData = res.data.data;
                switch (detailData.status) {
                    case 1:
                        detailData.statusName = langData.statusText1;
                        break;
                    case 2:
                        detailData.statusName = langData.statusText2;
                        break;
                    case 3:
                        detailData.statusName = langData.statusText3;
                        break;
                    default:
                        detailData.statusName = langData.statusText4;
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