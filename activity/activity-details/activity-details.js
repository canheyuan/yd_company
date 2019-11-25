const app = getApp()//  //获取应用实例
var commonFn = require('../../utils/common.js');//一些通用的函数
var regionData = require('../../utils/region-data.js');
var WxParse = require('../../wxParse/wxParse.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        isIndexBtnShow:false,
        detailsData: null,  //数据
        hasUserInfo: true, //是否有用户信息

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

        this.getActivityInfo(options.id); //获取活动信息
        //this.getActivityInfo('5c22e208829a7cbea64e0ffcc36b37bc')
    },

    //点击报名提示弹窗
    loginTipShow(e) {
        var formId = e.detail.formId;
        var url = e.currentTarget.dataset.url;
        if (!app.globalData.isLogin) {
            this.setData({ hasUserInfo: false });
        } else {
            app.getFormIdFn(formId, () => {
                wx.navigateTo({ url: url });
            })
            
        }
    },

    //点击评论提示弹窗
    loginTipShow2(e) {
        if (!app.globalData.isLogin) {
            this.setData({ hasUserInfo: false });
        }
    },

    //关闭登录提示弹窗
    closePopFn() {
        this.setData({ hasUserInfo: true });
    },

    //获取互动详情信息
    getActivityInfo(id) {
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

                
                this.setData({ detailsData: detailData });

                WxParse.wxParse('rule', 'html', detailData.rule, _this, 0);
                WxParse.wxParse('tips', 'html', detailData.tips, _this, 0);

            }
        });
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
