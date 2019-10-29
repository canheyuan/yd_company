const app = getApp()//  //获取应用实例
var commonFn = require('../../../utils/common.js');//一些通用的函数

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null,  //数据
        langData: null,  //语言数据
        langType: '',    //语言类型


        houseImgs:[
            "https://5iparks.com/profile/2019/09/76cdfa9eb25ad34f6dd9b24a024ccffa.jpg",
            "https://5iparks.com/profile/2019/09/29d625397848423dcdce400c71178e46.jpg",
            "https://5iparks.com/profile/2019/09/c5205f4ba202912b9c09720f955b2dce.jpg",
            "https://5iparks.com/profile/2019/09/2bfa9ddf04942d34e2f1f399ac412af5.jpg",
            "https://5iparks.com/profile/2019/09/343a273bafc44f7d92e95027a47adc31.png",
            "https://5iparks.com/profile/2019/09/037155193bb75d0480fca5cc17380a3b.png"
        ]
    },

    onLoad: function (options) {
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' };
        wx.setStorageSync('backUrl', backUrl);

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
