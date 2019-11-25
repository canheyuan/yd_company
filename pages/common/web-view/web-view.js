
Page({

  data: {
    gotoUrl:""
  },

  onLoad: function (options) {
    this.setData({ gotoUrl: options.url })
  },


  // 用户点击右上角分享
  onShareAppMessage: function () {
  
  }
})