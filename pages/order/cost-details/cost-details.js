const app = getApp(); //获取应用实例
Page({
  //页面的初始数据
  data: {
    domainUrl: app.globalData.domainUrl,
    userInfo:null,
    detailsData: null,     //详情数据
      langData: null,  //语言数据
      langType: '',    //语言类型
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {

      //设置语言,判断是否切换语言
      app.loadLangFn(this, 'order', (res) => {
          wx.setNavigationBarTitle({ title: res.costDetailTitle });  //设置当前页面的title
      });

    this.getDetaisFn(options.id);
    //this.getDetaisFn('57f15c0ef52a87273e499095b7c20554'); //租金
    //this.getDetaisFn('5b47acc1e985678b4390bbfa6388da79'); //水费
    //this.getDetaisFn('4f1d00c024fadf2d4fc2b572f273b11e'); //电费
    if (app.globalData.loginInfo){
      this.setData({ userInfo: app.globalData.loginInfo.userInfo });
    }
    
  },

  //获取互动详情信息
  getDetaisFn(id) {
    var _this = this;
    app.requestFn({
      url: `/bill/feeDetail/${id}`,
      success: (res) => {
        console.log("缴费详情：", res.data.data);
        var data = res.data.data;
        data.month = data.bill.feePeriod.substring(5, 7);
        this.setData({ detailsData: data });
      }
    });

  }
})