//获取应用实例
const app = getApp()

Page({
  data: {
    domainUrl: app.globalData.domainUrl,
    //幻灯片数据
    indexSlide: [
      {
        link: '11',
        image: '/images/index/c_img.png'
      },
      {
        link: '22',
        image: '/images/index/c_img.png'
      }
    ],
    reserveTimeData:{
      time1: '',//默认起始时间  
      s_time1:'00:00',
      e_time1: '24:00',
      time2: '',//默认结束时间 
      s_time2: '00:00',
      e_time2: '24:00'
    }
    
  },
  // 时间段选择  
  bindTimeChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      ['reserveTimeData.time1']: e.detail.value,
      ['reserveTimeData.s_time2']: e.detail.value
    })
  },
  bindTimeChange2(e) {
    let that = this;
    that.setData({
      ['reserveTimeData.time2']: e.detail.value,
      ['reserveTimeData.e_time1']: e.detail.value
    })

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