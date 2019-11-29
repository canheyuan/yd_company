const app = getApp();  //获取应用实例
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        reach:1
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'foundIndex', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.companyNews[lang] });  //设置当前页面的title
        });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.setData({ reach:Math.random()+1})
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {
        this.setData({ reach: Math.random() });
    }
})