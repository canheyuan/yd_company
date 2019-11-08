const app = getApp(); //获取应用实例
var WxParse = require('../../../wxParse/wxParse.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        lang: '',    //语言类型
        detailData:null,

        regionName:'请选择'
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve', (res, lang) => {
            
        });

        this.getDetailFn(options.id)
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    //获取详情
    getDetailFn(id) {
        var _this = this;
        app.requestFn({
            url: `/serviceInfo/detail/${id}`,
            success: (res) => {
                console.log('服务详情：',res.data)
                var detailData = res.data.data;
                detailData.supplier.star = parseInt(detailData.supplier.star);
                WxParse.wxParse('description', 'html', detailData.description, _this, 0);
                this.setData({ detailData: detailData });
                wx.setNavigationBarTitle({ title: detailData.name });  //设置当前页面的title
            }
        })
    },

    //改变地区
    regionChangeFn(e){
        console.log('改变地区：',e)
        var value = e.detail.value;
        var regionName = value.join(' ');
        this.setData({ regionName: regionName })
    },

    //跳转下单
    gotoOrderFn(e){
        wx.setStorageSync('serveDetail', this.data.detailData); //设置缓存用户信息
        wx.navigateTo({ url: `/pages/services/serve-order/serve-order` })
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