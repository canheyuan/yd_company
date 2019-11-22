const app = getApp();    //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const formTip = require('../../../utils/validateForm.js');   //验证
var countGetCodeTimer = null;

Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        getCode: {
            phone: '',
            code: '',
            timer: null,
            text: '',
            sending: false,  //是否已发送
        },

        verificationId: '', //验证码id
        goUrl: '',  //跳转的链接

        langData: null,  //语言数据
        lang: '',    //语言类型

    },

    onLoad: function (options) {
        var goUrl = wx.getStorageSync('backUrl') ? wx.getStorageSync('backUrl') : null;
        this.setData({ goUrl: goUrl });

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'recommend', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.referrerTitle[lang] });  //设置当前页面的title
            this.setData({
                ['getCode.text']: res.public.getCodeBtn[lang]
            })
        });
    },

    //失去焦点时获取手机号码
    changePhoneFn(e) {
        this.setData({ ['getCode.phone']: e.detail.value })
    },

    //获取手机code
    changeCodeFn(e) {
        this.setData({ ['getCode.code']: e.detail.value });
    },

    //验证码倒计时
    countGetCodeFn() {
        var _this = this, time = 60;
        var langData = this.data.langData
        var lang = this.data.lang
        countGetCodeTimer = setInterval(function () {
            if (time > 0) {
                _this.setData({
                    ['getCode.text']: `${langData.public.getCodeBtn2[lang] + time}S`,
                    ['getCode.sending']: true,
                });
            } else {
                clearInterval(countGetCodeTimer);
                _this.setData({
                    ['getCode.text']: langData.public.getCodeBtn[lang],
                    ['getCode.sending']: false,
                });
            }
            time--;
        }, 1000);
    },


    //获取验证码
    getCodeFn(e) {
        var langData = this.data.langData
        var lang = this.data.lang
        if (this.data.getCode.sending) { return; } //防止多次点击
        var _this = this,
            phone = this.data.getCode.phone

        //验证
        var isTip = formTip([
            { name: 'phone', verifyText: phone },
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序

        _this.countGetCodeFn(); //倒计时

        //获取验证码
        app.requestFn({
            loadTitle: langData.public.sendTip[lang],
            url: `/sendRegisterCode`,
            header: 'application/x-www-form-urlencoded',
            data: {
                mobile: phone
            },
            method: 'POST',
            success: (res) => {
                wx.showToast({ title: langData.public.sendSuccessTip[lang], icon: 'success', duration: 3000 });
                _this.setData({ verificationId: res.data.data.id })
            },
            fail: () => {
                wx.showToast({ title: langData.public.getCodeError[lang], icon: 'none', duration: 3000 });
                clearInterval(countGetCodeTimer);
                _this.setData({
                    ['getCode.text']: langData.public.getCodeBtn[lang],
                    ['getCode.sending']: false
                });
            },
        });
    },


    //确认提交信息
    formSubmit(e) {
        var _this = this;
        var formData = e.detail.value;
        var formId = e.detail.formId;

        //验证
        var isTip = formTip([
            { name: 'phone', verifyText: formData.mobile },
            { name: 'verifyCodeEmpty', verifyText: formData.verifyCode }
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序

        var openId = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo').otherLoginId : '';   //清除之前缓存
        formData['openId'] = openId;

        //提交预约信息
        app.requestFn({
            url: `/houseDistribution/createReferrer`,
            header: 'application/x-www-form-urlencoded',
            data: formData,
            method: 'POST',
            success: (res) => {

                if (!_this.data.goUrl) {
                    wx.switchTab({ url: '/pages/index/index' });
                } else if (_this.data.goUrl.type == 'switchTab') {
                    wx.switchTab({ url: _this.data.goUrl.url });
                } else {
                    wx.navigateTo({ url: _this.data.goUrl.url });
                }
            }
        });

    }
})


