
//获取应用实例
const app = getApp();

Page({
  data: {
    domainUrl: app.globalData.domainUrl,
    reachData:Math.random(),
    isIndexBtnShow:false,

      langData: null,  //语言数据
      langType: '',    //语言类型
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function (e) {
    //动态赋予一个随机数触发组件上拉加载下一页函数
    this.setData({
      reachData:Math.random()
    })
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    if (options.from == 'ma_msg'){
      this.setData({ isIndexBtnShow: true });
    }

    //设置语言,判断是否切换语言
    app.loadLangFn(this, 'activity', (res) => {
        wx.setNavigationBarTitle({ title: res.myActTitle });  //设置当前页面的title
    });
  }
})