
const app = getApp(); //获取应用实例

Page({
  data: {
    domainUrl : app.globalData.domainUrl,
    userInfo  : null,
  },

  /** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.loginInfo.userInfo
    })
  }
})