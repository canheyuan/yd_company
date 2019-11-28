//一些通用的函数
const commonFn = require('../../utils/common.js');
var WxParse = require('../../wxParse/wxParse.js');//富文本
const app = getApp();
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        detailData: null,  //数据
        newsId: "",  //新闻列表对应ID
        discussReach:1,

        isLoginPopHide:true,
        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function (options) {
        //保存当前页面地址，登录页后回到这个页面
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' };
        wx.setStorageSync('backUrl', backUrl);

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'foundIndex', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.tagNews[lang] });  //设置当前页面的title
        });

        this.setData({ newsId: options.id });
        this.getDetailFn(options.id);
    },

    //获取新闻信息
    getDetailFn(newsId) {
        var _this = this;
        app.requestFn({
            url: `/news/detail/${newsId}`,
            success: (res) => {
                //console.log("新闻详情页：", res.data.data);
                var detailData = res.data.data;
                detailData.publishTime = commonFn.getDate(detailData.publishTime).substr(0, 16);
                WxParse.wxParse('content', 'html', detailData.content, _this, 0); //富文本转换
                _this.setData({ detailData: detailData });
            }
        });
    },

    //定位到评论区域
    scrollDiscussFn(e) {
        this.setData({ scrollToView: 'discuss-list' })
    },

    //上拉加载更多评论
    loadMoreFn(e) {
        this.setData({ discussReach: Math.random() })
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.getDetailFn(this.data.newsId);
        this.setData({ discussReach: Math.random()+1 })
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //监听scroll-view内容滚动判断是否显示返回顶部按钮
    scrollFn(e) {
        console.log('监听scroll-view内容滚动',e.detail)
        if (e.scrollTop > 800 && !this.data.backTopShow) {
            this.setData({ backTopShow: true });
        } else if (e.scrollTop < 800 && this.data.backTopShow) {
            this.setData({ backTopShow: false });
        }
    },

    //转发
    onShareAppMessage: function () {
        console.log('share:', app.globalData.foundReach)
    }
})