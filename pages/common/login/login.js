const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js');   //一些通用的函数
const formTip = require('../../../utils/validateForm.js');   //验证

Page({
    data: {
        domainUrl: app.globalData.domainUrl, //图片域名前缀
        userInfo: null,  //用户信息
        goUrl: null,    //登录后跳转的地址

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //页面加载完后
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'formPage', (res) => {
            wx.setNavigationBarTitle({ title: res.loginTitle });  //设置当前页面的title
        });

        if (app.globalData.loginInfo) {
            this.setData({ userInfo: app.globalData.loginInfo.userInfo });
        }
        var goUrl = wx.getStorageSync('backUrl') ? wx.getStorageSync('backUrl') : null;
        this.setData({ goUrl: goUrl });
    },

    //获取微信手机号
    getPhoneNumber(e){
        console.log('getPhoneNumber:',e);
    },

    //点击立即登录按钮触发
    formSubmit(e) {
        var _this = this;
        var formData = e.detail.value;
        var langData = _this.data.langData;
        console.log("form数据", formData);

        //验证
        var isTip = formTip([
            { name: 'phone', verifyText: formData.username },
            { name: 'password', verifyText: formData.password },
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序

        var openId = app.globalData.openId ? app.globalData.openId : '';   //清除之前缓存
        formData['openId'] = openId;

        app.requestFn({
            loadTitle: langData.public.submit,
            isSessionId: false, //不需要传sessionId
            url: `/login`,
            header: 'application/x-www-form-urlencoded',
            data: formData,
            method: 'POST',
            success: (res) => {
                var loginInfo = res.data.data;
                wx.removeStorageSync('userInfo'); //清除之前缓存
                app.globalData.sessionId = loginInfo.sessionId; //存储登录后的sessionId,记录登录状态
                app.getWxLoginInfo(function () {
                    //重置所有刷新状态
                    app.resetAllReach();
                    
                    app.globalData.isLogin = true;  //登录状态
                    app.getImUserInfo();
                    if (!_this.data.goUrl) {
                        wx.switchTab({ url: '/pages/index/index' });
                    } else if (_this.data.goUrl.type == 'switchTab') {
                        wx.switchTab({ url: _this.data.goUrl.url });
                    } else {
                        wx.navigateTo({ url: _this.data.goUrl.url });
                    }

                });
            }
        });
    }
})