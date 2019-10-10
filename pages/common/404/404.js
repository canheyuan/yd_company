const commonFn = require('../../../utils/common.js');   //一些通用的函数

Page({

  /**
   * 页面的初始数据
   */
  data: {
      num:0,
      thisTimer :null
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

  //生命周期函数--监听页面显示
  onShow: function () {
  
  },


    timer(){

        

        console.log('timer');
        this.data.thisTimer = setInterval(()=>{
            if (this.data.num>20){
                clearInterval(this.data.thisTimer)
                
                console.log('关闭定时器:', this.data.num);
            }else{
                this.setData({ num: this.data.num + 1 })
                console.log('定时器:', this.data.num);
            }
        },1000)
    },

    closeTimer(){
        console.log('按钮关闭定时器');
        clearInterval(this.data.thisTimer)
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