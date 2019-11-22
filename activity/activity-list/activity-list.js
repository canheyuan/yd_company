

const app = getApp();//获取应用实例
var commonFn = require('../../utils/common.js');//一些通用的函数
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        reach: null,

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function (e) {
        //动态赋予一个随机数触发组件上拉加载下一页函数
        this.setData({
            reach: Math.random()
        })
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' };
        wx.setStorageSync('backUrl', backUrl);

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'activity', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.listTitle[lang] });  //设置当前页面的title
            this.setData({ reach: Math.random() + 1 })
        });
    }
})