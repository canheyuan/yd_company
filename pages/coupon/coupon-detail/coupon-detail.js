const app = getApp();
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数
Page({

  //页面的初始数据
  data: {
    domainUrl: app.globalData.domainUrl,
    detailData:null, //详情数据

      langData: null,  //语言数据
      langType: '',    //语言类型
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
      //设置语言,判断是否切换语言
      app.loadLangFn(this, 'coupon', (res) => {
          wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
      });

    this.getDetailFn(options.id);
  },

  //生命周期函数--监听页面显示
  onShow: function () {
    
  },

  //获取数据
  getDetailFn(id) {
      var langData = this.data.langData;
    app.requestFn({
      url: `/userCoupon/detail/${id}`,
      success: (res) => {
        var detailData = res.data.data;
        //循环数组转换时间戳
        detailData.useStart = detailData.useStart ? detailData.useStart.slice(5, 11):'';
        detailData.useEnd = detailData.useEnd ? detailData.useEnd.slice(5, 11):'';
        detailData.issueTime = detailData.issueTime ? detailData.issueTime.slice(5, 16):'';

          if (detailData.couponType == 1) {
              var discountArr = detailData.discountText.split(',');
              detailData.discountPrice = discountArr[1] + langData.public.yuanText;
              detailData.discountSumPrice = discountArr[0] > 0 ? `${langData.manText}${discountArr[0]}${$langData.text1}` : langData.text3;
          } else if (detailData.couponType == 2) {
              var discountArr = detailData.discountText.split(',');
              detailData.discountPrice = discountArr[1] + langData.public.zheText;
              detailData.discountSumPrice = discountArr[0] > 0 ? `${langData.manText}${discountArr[0]}${langData.text2}` : langData.text3;
          }
        this.setData({ detailData: detailData });
      }
    });
  }

})