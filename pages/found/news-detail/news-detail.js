//一些通用的函数
const commonFn = require('../../../utils/common.js');
var WxParse = require('../../../wxParse/wxParse.js');//富文本
const app = getApp();
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        newsData: null,  //数据
        newsId: "",  //新闻列表对应ID

        isLoginPopHide:true,
        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {
        //保存当前页面地址，登录页后回到这个页面
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' };
        wx.setStorageSync('backUrl', backUrl);

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'foundIndex', (res) => {
            wx.setNavigationBarTitle({ title: res.tagNews });  //设置当前页面的title
        });

        this.setData({ newsId: options.id });
        this.getNewsInfo(options.id);
    },

    //获取新闻信息
    getNewsInfo(newsId) {
        var _this = this;
        app.requestFn({
            url: `/news/detail/${newsId}`,
            success: (res) => {
                console.log("新闻详情页：", res.data.data);
                var newsData = res.data.data;
                newsData.publishTime = commonFn.getDate(newsData.publishTime).substr(0, 16);
                WxParse.wxParse('content', 'html', newsData.content, _this, 0); //富文本转换
                _this.setData({ newsData: newsData });
            }
        });
    },

    //滚动到评论区域
    scrollToDoFn(e) {
        wx.createSelectorQuery().select('#discuss_ctn').fields({
            rect: true
        }, function (res) {
            wx.pageScrollTo({ scrollTop: res.top });
        }).exec()
    },

    //关闭登录提示弹窗
    closePopFn() {
        this.setData({ isLoginPopHide: true });
    },

    //点击评论提示弹窗
    loginTipShow2(e) {
        if (!app.globalData.isLogin) {
            this.setData({ isLoginPopHide: false });
        }
    },

    //转发
    onShareAppMessage: function () {

    }
})