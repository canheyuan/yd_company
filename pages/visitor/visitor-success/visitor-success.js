

const app = getApp(); //获取应用实例
const commonFn = require('../../../utils/common.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null,

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'visitor', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.visitorSuccess[lang] });  //设置当前页面的title
        });
        this.getDetailFn(options.id);
    },

    //获取详情信息
    getDetailFn(id) {
        var that = this;
        app.requestFn({
            url: `/visitorReservation/detail/${id}`,
            success: (res) => {
                var detailsData = res.data.data;
                this.setData({ detailsData: detailsData });
            }
        });
    }

})