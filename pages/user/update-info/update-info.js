const app = getApp();  //获取应用实例
//const datas = require('updata-data.js');//页面内容数据
Page({

  //页面的初始数据
  data: {
    pageData:{},  //渲染到页面的数据
    valueTxt:'',
    changeName:'',

      langData: null,  //语言数据
      lang: '',    //语言类型
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    var updata_type = options.type;
    var default_value = options.value;
      //设置语言,判断是否切换语言
          app.loadLangNewFn(this, 'updataInfo', (res, lang) => {
          let pageInfo = res[updata_type];
          //设置加载的内容和文本框默认值
          this.setData({
              pageData: pageInfo,
              valueTxt: default_value,
              changeName: updata_type
          });

          //设置title
          wx.setNavigationBarTitle({ title: pageInfo.pageTitle[lang] });

      });
  },

  //清除文本框
  clearInputFn(){
    this.setData({ valueTxt:'' });
  },

  //提交数据
  formSubmit(e){
    var _this = this;
    var formData = e.detail.value;
    var langData = this.data.langData
    var lang = this.data.lang
    app.requestFn({
        isLoading: false,
      url: `/userInfo/update`,
      header: 'application/x-www-form-urlencoded',
      data: formData,
      method: 'POST',
      success: (res) => {
        //获取缓存，改变缓存里的信息，然后重新设置缓存
          var loginInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo'):null;
          loginInfo.userInfo[_this.data.changeName] = formData[_this.data.changeName];
          wx.setStorageSync('userInfo', loginInfo); //设置缓存用户信息
          app.globalData.loginInfo = loginInfo;  //获取用户信息

        app.globalData.userIndexReach = true;
        app.globalData.userInfoReach = true;

          wx.showToast({ title: langData.public.editSuccess[lang], icon: "success", duration: 2000 });
        
        if (_this.data.changeName == 'name') { _this.setUserImg(_this.data.changeName)}
        setTimeout(function () {  wx.navigateBack(); }, 2000);
      }
    });
  },

  //修改IM用户信息
  setUserImg(name) {
    var _this = this;
    var options = {
      'ProfileItem': [
        { "Tag": "Tag_Profile_IM_Nick", "Value": name }
      ]
    };
    webim.setProfilePortrait(options, function () {
        app.chatData.fromUser.nick = name;
    });
  },


})