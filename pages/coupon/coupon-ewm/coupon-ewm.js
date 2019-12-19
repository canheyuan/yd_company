const app = getApp();
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数
const QR = require('../../../utils/qrcode.js'); //生成二维码
var couponTimer = null;
Page({

    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        detailData: null, //详情数据

        canvasHidden: false,
        maskHidden: true,
        isFirst: true, //判断是否是第一次加载接口

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'coupon', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.useTitle[lang] });  //设置当前页面的title
        });

        this.getDetailFn(options.id);

        var size = this.setCanvasSize();//动态设置画布大小
        this.createQrCode(options.id, "mycanvas", size.w, size.h);

        couponTimer = setInterval(() => {
            this.getDetailFn(options.id);
        }, 3000);
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    onHide: function () {
        //console.log('关闭页面')
        clearInterval(couponTimer);
    },

    onUnload() {
        //console.log('卸载页面');
        clearInterval(couponTimer);
    },

    //获取数据
    getDetailFn(id) {
        var langData = this.data.langData
        var lang = this.data.lang
        app.requestFn({
            isLoading: false,
            url: `/userCoupon/detail/${id}`,
            success: (res) => {
                var detailData = res.data.data;
                if (detailData.status == 0 && !this.data.isFirst) { //未使用且不是第一次加载接口
                    return;
                }
                //循环数组转换时间戳
                detailData.useStart = detailData.useStart ? detailData.useStart.slice(5, 11) : '';
                detailData.useEnd = detailData.useEnd ? detailData.useEnd.slice(5, 11) : '';
                detailData.issueTime = detailData.issueTime ? detailData.issueTime.slice(5, 16) : '';

                if (detailData.couponType == 1) {
                    var discountArr = detailData.discountText.split(',');
                    detailData.discountTxt = discountArr[0] > 0 ? `${langData.manText[lang]}${discountArr[0]}${langData.text1[lang]}${discountArr[1]}${langData.public.yuanText[lang]}` : `${langData.jianText[lang]}${discountArr[1]}${langData.public.yuanText[lang]}`
                } else if (detailData.couponType == 2) {
                    var discountArr = detailData.discountText.split(',');
                    detailData.discountTxt = discountArr[0] > 0 ? `${langData.manText[lang]}${discountArr[0]}${langData.text4[lang]}${discountArr[1]}${langData.public.zheText[lang]}` : `${discountArr[1]}${langData.public.zheText[lang]}`
                }

                if (detailData.status == 1 && !this.data.isFirst) { //未使用且不是第一次加载接口
                    clearInterval(couponTimer);
                    // wx.reLaunch({
                    //     url: '/pages/common/result/result?page=coupon'
                    // });
                    wx.redirectTo({
                        url: '/pages/common/result/result?page=coupon'
                    });
                }

                this.setData({
                    isFirst: false,
                    detailData: detailData
                });

            }
        });
    },

    //适配不同屏幕大小的canvas
    setCanvasSize: function () {
        var size = {};
        try {
            var res = wx.getSystemInfoSync();
            //不同屏幕下canvas的适配比例；设计稿是750宽
            var scale = 750 / 450;
            var width = res.windowWidth / scale;
            var height = width;//canvas画布为正方形
            size.w = width;
            size.h = height;
        } catch (e) {
            // Do something when catch error
            console.log("获取设备信息失败" + e);
        }
        return size;
    },

    createQrCode: function (url, canvasId, cavW, cavH) {
        //调用插件中的draw方法，绘制二维码图片
        QR.api.draw(url, canvasId, cavW, cavH);
        setTimeout(() => { this.canvasToTempImage(); }, 1000);
    },

    //获取临时缓存照片路径，存入data中
    canvasToTempImage: function () {
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function (res) {
                var tempFilePath = res.tempFilePath;
            },
            fail: function (res) {
                //console.log(res);
            }
        });
    }

})