const app = getApp();
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数
Page({

    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        detailData: null, //详情数据

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'coupon', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });

        this.getDetailFn(options.id);
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    //获取数据
    getDetailFn(id) {
        var langData = this.data.langData
        var lang = this.data.lang
        app.requestFn({
            url: `/userCoupon/detail/${id}`,
            success: (res) => {
                var detailData = res.data.data;
                //循环数组转换时间戳
                detailData.useStartDate = detailData.useStart ? detailData.useStart.slice(0, 11) : '';
                detailData.useEndDate = detailData.useEnd ? detailData.useEnd.slice(0, 11) : '';
                detailData.issueDate = detailData.issueTime ? detailData.issueTime.slice(0, 11) : '';

                if (detailData.couponType == 1) {
                    var discountArr = detailData.discountText.split(',');
                    detailData.discountPrice = discountArr[1] + langData.public.yuanText[lang];
                    detailData.discountSumPrice = discountArr[0] > 0 ? `${langData.manText[lang]}${discountArr[0]}${langData.text1[lang]}` : langData.text3[lang];
                } else if (detailData.couponType == 2) {
                    var discountArr = detailData.discountText.split(',');
                    detailData.discountPrice = discountArr[1] + langData.public.zheText[lang];
                    detailData.discountSumPrice = discountArr[0] > 0 ? `${langData.manText[lang]}${discountArr[0]}${langData.text2[lang]}` : langData.text3[lang];
                }
                this.setData({ detailData: detailData });
            }
        });
    }

})