
const app = getApp();
const commonFn = require('../../../utils/common.js'); //获取应用实例
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null, //详情数据

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'complaint', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });

        this.getRepairDetail(options.id); //获取投诉信息

    },

    //获取投诉详情
    getRepairDetail(id) {
        app.requestFn({
            url: `/estateComplaint/detail/${id}`,
            success: (res) => {
                var detailsData = res.data.data;
                detailsData.applyTime = commonFn.getDate(detailsData.applyTime);
                this.setData({
                    detailsData: detailsData
                })
                console.log("投诉详情", detailsData);
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
