
const app = getApp();
const commonFn = require('../../../utils/common.js'); //获取应用实例
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        detailData: null, //详情数据

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
            app.loadLangNewFn(this, 'complaint', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });
        this.getRepairDetail(options.id); //获取投诉信息
    },

    //获取投诉详情
    getRepairDetail(id) {
        app.requestFn({
            url: `/estateComplaint/detail/${id}`,
            success: (res) => {
                var detailData = res.data.data;
                detailData.applyTime = detailData.applyTime ? commonFn.getDate(detailData.applyTime) : '';
                detailData.processTime = detailData.processTime ? commonFn.getDate(detailData.processTime) : '';
                detailData.finishTime = detailData.finishTime ? commonFn.getDate(detailData.finishTime) : '';
                this.setData({ detailData: detailData })
            }
        });
    },

    //图片放大
    bigImgFn(e) {
        var index = e.currentTarget.dataset.index;
        var imgList = e.currentTarget.dataset.imgs;
        wx.previewImage({
            current: imgList[index],  // 当前显示图片的http链接
            urls: imgList             // 需要预览的图片http链接列表
        })
    },


})
