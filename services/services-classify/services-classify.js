//获取应用实例
const app = getApp()
Page({
  //页面的初始数据
  data: {
    domainUrl: app.globalData.domainUrl,
    //选项卡切换title列表
    tagList:null,
    tagIndex:0, //选项卡切换索引

      langData: null,  //语言数据
      langType: '',    //语言类型
  },

  //选项卡切换
  tagChangeFn(e) {
    this.setData({
      tagIndex: e.currentTarget.dataset.index,
    });
    console.log("索引",this.data.tagIndex)
  },

  onLoad: function (options) {
    this.setData({ tagIndex : options.tag });
      //设置语言,判断是否切换语言
      app.loadLangFn(this, 'services', (res) => {
          wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
      });
    this.getServiceList();
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.getServiceList();
    wx.stopPullDownRefresh(); //下拉刷新后页面上移
  },

  getServiceList() {
    var _this = this;
    app.requestFn({
      url: '/enterpriseService/categoryList',
      success: (res) => {
        var tag = res.data.data;
        this.setData({ tagList: tag });
      }
    });
  },
  goToIntro(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/services/services-intro/services-intro?id=${id}`
    })
  }
  
})