const app = getApp();
var commonFn = require('../../../utils/common.js'); //一些通用的函数
var WxParse = require('../../../wxParse/wxParse.js');


Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        noticeData: null,  //数据
    },

    onLoad: function (options) {
        this.getNoticeInfo(options.id);
    },
    //获取消息详情信息
    getNoticeInfo(noticeId) {
        var _this = this;
        app.requestFn({
            url: `/noticeInfo/detail/${noticeId}`,
            success: (res) => {
                var noticeData = res.data.data;
                noticeData.content = commonFn.replaceTxt(noticeData.content);  //替换<o:p>等标签
                WxParse.wxParse('content', 'html', noticeData.content, _this, 0);
                wx.setNavigationBarTitle({ title: noticeData.title });    //设置标题
                this.setData({ noticeData: noticeData });

            }
        });
    },


    //用户点击右上角分享
    onShareAppMessage: function (e) {

    }
})