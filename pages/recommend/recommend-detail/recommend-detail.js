

const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
var WxParse = require('../../../wxParse/wxParse.js');
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        detailData: null,
        distId: '',  //分销ID
        shareId: '', //分享ID
        isLogin: false,
        tipPopShow: false,

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'recommend', (res) => {
            wx.setNavigationBarTitle({ title: res.detailTitle });  //设置当前页面的title
        });

        var _this = this;
        this.setData({
            shareId: options.scene ? decodeURIComponent(options.scene) : '',
            //shareId:'f7979e4508caa2d366fe0d6467825bff',
            isLogin: app.globalData.isLogin
        });

        //判断是否已经授权，是否弹窗
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userInfo'] && !app.globalData.isLogin) {
                    _this.setData({ tipPopShow: true });
                }
            }
        });

        if (app.globalData.sessionId) {
            this.firstLoad();
        } else {
            //sessionId是通过异步请求的，所以加了个定时器监听sessionid是否获取到了
            var timer = setInterval(() => {
                if (app.globalData.sessionId) {
                    clearInterval(timer);
                    this.firstLoad();
                }
            }, 300);
        }

    },

    //判断加载详情
    firstLoad(){
        if (!this.data.shareId) {
            this.getDetailFn({
                url: '/houseDistribution/myParkDist'
            });
        } else {
            this.getDetailFn({
                url: '/houseDistribution/detail',
                data: { shareId: this.data.shareId }
            });
        }
    },

    //获取用户信息
    getUserInfoFn(e) {
        var _this = this;
        wx.removeStorageSync('userInfo'); //清除之前缓存
        app.getWxLoginInfo(function () {
            wx.hideLoading();
            _this.setData({ tipPopShow: false });
        });
    },


    //获取详情信息
    getDetailFn(opt) {
        var _this = this;
        app.requestFn({
            url: opt.url,
            data: opt.data,
            success: (res) => {
                console.log("分销详情：", res);
                var detailData = res.data.data ? res.data.data : null;
                if (detailData) {
                    detailData.serviceTags = detailData.serviceTags.split(',');
                    detailData.parkImg = detailData.parkImg.split(',');
                    detailData.intro = commonFn.replaceTxt(detailData.intro);//富文本去掉<o:p>等标签
                    detailData.traffic = commonFn.replaceTxt(detailData.traffic);//富文本去掉<o:p>等标签

                    WxParse.wxParse('intro', 'html', detailData.intro, _this, 0);
                    WxParse.wxParse('traffic', 'html', detailData.traffic, _this, 0);

                    wx.setStorageSync('recomendDetail', detailData); //设置缓存用户信息
                    _this.setData({ detailData: detailData });
                }

            }
        });
    },

    //跳转到推广二维码页
    gotoUrlFn(e) {
        var url = '';
        var distId = this.data.detailData.distId;
        var shareId = this.data.shareId;
        if (app.globalData.isLogin) {
            url = `/pages/recommend/recommend-share/recommend-share?dist_id=${distId}&share_id=${shareId}`;
        } else {
            var backUrl = { url: `/pages/recommend/recommend-share/recommend-share?dist_id=${distId}&share_id=${shareId}` };
            wx.setStorageSync('backUrl', backUrl);
            url = `/pages/recommend/create-referrer/create-referrer?dist_id=${distId}&share_id=${shareId}`;
        }
        wx.navigateTo({ url: url });
    },

    //拨打电话
    makePhoneCallFn(e) {
        var phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({ phoneNumber: phone })
    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        console.log('图片加载失败', e.currentTarget.dataset.obj)
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

    //浏览户型图片
    goToRoom(e) {
        var imgList = e.currentTarget.dataset.imgs;
        app.previewImgFn(imgList[0], imgList);
    },

    //用户点击右上角分享
    onShareAppMessage: function () {

    }
})