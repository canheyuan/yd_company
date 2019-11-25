const app = getApp()    //获取应用实例
const commonFn = require('../../../utils/common.js');   //一些通用的函数
const formTip = require('../../../utils/validateForm.js');   //验证
var countGetCodeTimer = null;     //倒计时定时器

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

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad(options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'formPage', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.findPasswordTitle[lang] });  //设置当前页面的title
            this.setData({ ['getCode.text']: res.public.getCodeBtn[lang] });
        });
    },

    //失去焦点时获取手机号码
    changePhoneFn(e) {
        this.setData({ ['getCode.phone']: e.detail.value })
    },

    //获取手机code
    changeCodeFn(e) {
        this.setData({ ['getCode.code']: e.detail.value })
    },

    //验证码倒计时
    countGetCodeFn() {
        var _this = this, time = 60;
        var langData = this.data.langData
        var lang = this.data.lang
        countGetCodeTimer = setInterval(function () {
            if (time > 0) {
                _this.setData({ 
                    ['getCode.text']: `${langData.public.getCodeBtn2[lang] + time}S` ,
                    ['getCode.sending']: true,
                });
            } else {
                clearInterval(countGetCodeTimer);
                _this.setData({
                    ['getCode.text']: _this.data.langData.public.getCodeBtn[lang],
                    ['getCode.sending']: false,
                });
            }
            time--;
        }, 1000);
    },


    //获取验证码
    getCodeFn(e) {
        if (this.data.getCode.sending) { return; } //防止多次点击
        var langData = this.data.langData
        var lang = this.data.lang
        var _this = this, 
            phone = this.data.getCode.phone

        //验证
        var isTip = formTip([
            { name: 'phone', verifyText: phone },
        ]);
        if (isTip){return;} //若有提示，就终止下面程序

        _this.countGetCodeFn(); //倒计时

        //获取验证码
        app.requestFn({
            loadTitle: langData.public.sendTip[lang],
            url: `/sendResetPwdCode`,
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


    //确认提交重置
    formSubmit(e) {
        var _this = this;
        var formData = e.detail.value;
        console.log("form数据", formData);
        var langData = this.data.langData;
        var lang = this.data.lang
        //验证
        var isTip = formTip([
            { name: 'phone', verifyText: formData.mobile },
            { name: 'verifyCodeEmpty', verifyText: formData.verifyCode },
            { name: 'password', verifyText: formData.password },
            { name: 'passwordAgain', verifyText: formData.password2 },
            { name: 'passwordContrast', verifyText: formData.password, verifyText2: formData.password2 },
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序

        //验证验证码并提交重置密码
        app.requestFn({
            loadTitle: langData.public.submit[lang],
            url: `/resetpwd`,
            header: 'application/x-www-form-urlencoded',
            data: formData,
            method: 'POST',
            success: (res) => {
                wx.redirectTo({
                    url: '/pages/common/result/result?page=reset_pwd'
                })
            }
        });

    }
})