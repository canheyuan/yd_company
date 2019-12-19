const app = getApp()//  //获取应用实例
var commonFn = require('../../../utils/common.js');//一些通用的函数
var regionData = require('../../../utils/region-data.js');
var WxParse = require('../../../wxParse/wxParse.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        isIndexBtnShow:false,   //返回首页按钮是否显示
        backTopShow:false,  //返回顶部按钮是否显示
        
        detailData: null,  //数据信息
        loginPopHide: true, //是否有用户信息
        scrollToView:'',  //定位到页面某个位置，传元素id值
        discussReach:1,    //是否刷新评论列表
        
        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function (options) {
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' };
        wx.setStorageSync('backUrl', backUrl);

        if (options.from == 'ma_msg') {
            this.setData({ isIndexBtnShow: true });
        }

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'activity', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.detailTitle[lang] });  //设置当前页面的title
        });

        this.getDetailFn(options.id); //获取活动信息
    },

    //点击报名提示弹窗
    loginTipShow(e) {
        var formId = e.detail.formId;
        var url = e.currentTarget.dataset.url;
        console.log('url', url)
        if (!app.globalData.isLogin) {
            this.setData({ loginPopHide: false });
        } else {
            app.getFormIdFn(formId, () => {
                wx.navigateTo({ url: url });
            })
        }
    },

    //定位到评论区域
    scrollDiscussFn(e){
        this.setData({ scrollToView: 'discuss-list' })
    },

    //上拉加载更多评论
    loadMoreFn(e){
        this.setData({ discussReach:Math.random() })
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.getDetailFn(this.data.detailData.activityId);
        this.setData({ discussReach: Math.random() + 1 })
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //监听scroll-view内容滚动判断是否显示返回顶部按钮
    scrollFn(e) {
        console.log('监听scroll-view内容滚动', e.detail)
        if (e.detail.scrollTop > 800 && !this.data.backTopShow) {
            this.setData({ backTopShow: true });
        } else if (e.detail.scrollTop < 800 && this.data.backTopShow) {
            this.setData({ backTopShow: false });
        }
    },

    //获取互动详情信息
    getDetailFn(id) {
        var _this = this;
        var langData = this.data.langData;
        var lang = this.data.lang
        app.requestFn({
            url: `/activity/detail/${id}`,
            success: (res) => {

                var detailData = res.data.data;

                switch (detailData.status) {
                    case 1:
                        detailData.statusName = langData.status1[lang];
                        break;
                    case 2:
                        detailData.statusName = langData.status2[lang];
                        break;
                    case 3:
                        detailData.statusName = langData.status3[lang];
                        break;
                    case 4:
                        detailData.statusName = langData.status4[lang];
                        break;
                    case 5:
                        detailData.statusName = langData.status5[lang];
                        break;
                }

                detailData.rule = commonFn.replaceTxt(detailData.rule);//富文本去掉<o:p>等标签
                detailData.tips = commonFn.replaceTxt(detailData.tips);//富文本去掉<o:p>等标签

                detailData.provinceName = regionData.regionData(detailData.provinceId);   //省
                detailData.cityName = regionData.regionData(detailData.cityId);   //市
                detailData.areaName = regionData.regionData(detailData.areaId);   //区

                detailData.addressName = detailData.provinceName + detailData.cityName + detailData.areaName + detailData.address

                detailData.beginTime = commonFn.getDate(detailData.beginTime).substring(0,16);  //开始时间戳
                detailData.endTime = commonFn.getDate(detailData.endTime).substring(0, 16);  //结束时间戳

                
                this.setData({ detailData: detailData });

                WxParse.wxParse('rule', 'html', detailData.rule, _this, 0);
                WxParse.wxParse('tips', 'html', detailData.tips, _this, 0);
            }
        });
    },

    closePopFn(){
        this.setData({ loginPopHide : true })
    },

    //用户点击右上角分享
    onShareAppMessage: function (e) {

    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

})
