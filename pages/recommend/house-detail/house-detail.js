const app = getApp()//  //获取应用实例
var commonFn = require('../../../utils/common.js');//一些通用的函数
var WxParse = require('../../../wxParse/wxParse.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        lang: '',    //语言类型
        
        detailData:null,    //详情信息
    },

    onLoad: function (options) {
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' }
        wx.setStorageSync('backUrl', backUrl)

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'house', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.detailTitle[lang] });  //设置当前页面的title
        });

        this.getDetailFn(options.id)
    },

    //获取详情信息
    getDetailFn(unitId) {
        var _this = this;
        app.requestFn({
            url: `/houseDistribution/unitDetail/${unitId}`,
            success: (res) => {
                console.log('详情信息：',res.data)
                var detailData = res.data.data
                detailData.areaResult = (detailData.biggestArea == detailData.smallestArea ? detailData.smallestArea : `${detailData.smallestArea}~${detailData.biggestArea}`)
                detailData.serviceTags = detailData.serviceTags.split(',');
                WxParse.wxParse('intro', 'html', detailData.parkIntro, _this, 0);
                WxParse.wxParse('traffic', 'html', detailData.traffic, _this, 0);
                this.setData({ detailData: detailData })
                console.log('详情信息：', detailData)
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

    //预览图片
    previewImg(e){
        var url = e.currentTarget.dataset.item
        var list = e.currentTarget.dataset.list
        app.previewImgFn(url,list)
    },

    //拨打电话
    makingPhoneFn(e){
        var verifyTime = this.verifyTime();
        if (verifyTime) {
            var phone = e.currentTarget.dataset.phone
            wx.makePhoneCall({ phoneNumber: phone });
        } else {
            wx.showToast({ title: '请在工作时间9:00 ~ 17:00进行联系', icon: 'none', duration: 3000 })
        }
    },

    //验证时间段
    verifyTime() {
        var b = false;
        var newDate = new Date();
        var weekNow = newDate.getDay();    //当前星期几：0-6
        var hour = newDate.getHours();
        if (weekNow == 0 || weekNow == 6 || hour <= 8 || hour >= 17) {
            b = false;
        } else {
            b = true;
        }
        return b;
    }

})
