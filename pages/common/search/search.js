//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domainUrl: app.globalData.domainUrl,
    //热门搜索标签
    hotLabelList:[
      { link: '', name: '彭博社报道' },
      { link: '', name: '今年的加密货币崩盘' },
      { link: '', name: '冒险电影' },
      { link: '', name: '导演署名' },
      { link: '', name: '胡桃夹子与四个王国' },
      { link: '', name: '近日这有消息称' },
      { link: '', name: 'Amazing Spider-Man' },
    ],
    searchHistoryList:[
      { link: '', name: '新研究揭示蜘蛛飞航'},
      { link: '', name: '小米Max3真机视频流出' },
      { link: '', name: '顺风车发生事故致2人死亡 车主起诉滴滴索要垫付款' },
      { link: '', name: '币安2018年净利润有望达5 - 10亿美元' },
      { link: '', name: '新研究揭示蜘蛛飞航' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})