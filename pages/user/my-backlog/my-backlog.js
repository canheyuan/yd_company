
const app = getApp();   //获取应用实例
Page({
  data: {
    domainUrl: app.globalData.domainUrl,
    reach:1
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function (e) {
    //动态赋予一个随机数触发组件上拉加载下一页函数
    this.setData({ reach:Math.random() })
  },

  onLoad: function (options) {
      
  }

})