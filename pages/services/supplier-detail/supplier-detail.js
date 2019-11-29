const app = getApp(); //获取应用实例
var WxParse = require('../../../wxParse/wxParse.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        lang: '',    //语言类型

        detailData:null,    //详情信息
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.supplierTitle[lang] });  //设置当前页面的title
        });
        this.getDetailFn(options.id);
    },

    //获取服务商详情
    getDetailFn(id) {
        var _this = this;
        app.requestFn({
            url: `/serviceSupplier/detail/${id}`,
            success: (res) => {
                console.log('服务商详情', res.data.data)
                var detailData = res.data.data
                WxParse.wxParse('caseIntro', 'html', detailData.caseIntro, _this, 0);
                WxParse.wxParse('serviceIntro', 'html', detailData.serviceIntro, _this, 0);
                this.setData({ detailData: detailData })
            }
        })
    },

    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {
        var id = this.data.detailData.id;
        this.getDetailFn(id);
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //用户点击右上角分享
    onShareAppMessage: function () {

    }
})