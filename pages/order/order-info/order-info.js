
const app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domainUrl: app.globalData.domainUrl,
    detailsData:null     //详情数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetaisFn(options.id);
    //this.getDetaisFn('488c5e01a2d5c6124011374e21431a61');
    
  },


  //获取互动详情信息
  getDetaisFn(id) {
    var _this = this;
    wx.showLoading({ title: '数据加载中', mask: true });
    wx.request({
      url: app.globalData.jkUrl + '/bill/detail/' + id,
      data: {
        
      },
      header: {
        'content-type': 'application/json', // 默认值
        '5ipark-sid': app.globalData.sessionId
      },
      dataType: 'json',
      success: (res) => {
        //读取接口成功回调函数
        if (res.data.code == 0) {
          console.log("订单详情：",res.data.data);
          var data = res.data.data;
          this.setData({
            detailsData: data
          });

        } else {
          wx.showToast({ title: '获取数据失败', icon: 'none', duration: 3000 });
          console.log(res.data.msg);
        }
      },
      //读取接口失败回调函数
      fail: () => {
        wx.showToast({ title: '获取数据失败', icon: 'none', duration: 3000 });
      },
      //读取接口后回调函数、不管成功与否都返回
      complete() {
        wx.hideLoading();
      }

    });
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