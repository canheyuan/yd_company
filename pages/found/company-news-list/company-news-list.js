const app = getApp();  //获取应用实例
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        reach:1
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

    },

    onShow() {

    },

    //下拉刷新
    onPullDownRefresh: function () {
        
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {
        this.setData({ reach: Math.random() });
    },
})