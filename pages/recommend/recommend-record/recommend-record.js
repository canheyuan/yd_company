

const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
Page({

  data: {
    domainUrl: app.globalData.domainUrl,
    detailData:null,
    distId:'',
    shareId:'',

      langData: null,  //语言数据
      langType: '',    //语言类型
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {

      //设置语言,判断是否切换语言
      app.loadLangFn(this, 'recommend', (res) => {
          wx.setNavigationBarTitle({ title: res.recordTitle });  //设置当前页面的title
      });

    this.setData({
      distId: options.dist_id ? options.dist_id : '',
      shareId: options.share_id ? options.share_id : ''
    });
    this.getDetailFn();
  },

  //获取行业类型列表
  getDetailFn() {
    var _this = this;
    app.requestFn({
      url: `/houseDistribution/myRecommend`,
      data: {
        distId: _this.data.distId,
        viewCount : 10, //默认显示列表条数`
      },
      success: (res) => {
        console.log(res);
        _this.setData({  detailData: res.data.data });
      }
    });

  },

  //图片加载失败显示默认图
  errorImgFn(e) {
    //有三个参数：当前页面this，要替换的对象，替换图片地址
    commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
  },

})