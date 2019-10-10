
const app = getApp()    //获取应用实例
const datas = require('data.js');   //获取页面内容
Page({
  data: {
    domainUrl: app.globalData.domainUrl,
    pageData: {}
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    const pageInfo = datas.page_data();
    var pageData = options.page ? pageInfo[options.page] : pageInfo['nothing'];
    if (options.page == 'activity'){
      pageData.details_btn_url = pageData.details_btn_url + '?id=' + options.id;
    }
    this.setData({ pageData: pageData });

    //设置title
    wx.setNavigationBarTitle({  title: pageData.page_title  })
  }
})