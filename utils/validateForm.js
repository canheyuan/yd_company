const app = getApp();  //获取应用实例
const commonFn = require('common.js'); //一些通用的函数
var lang = app.globalData.lang
var langData = app.globalData.langData.validate;



//b表单验证提示
var formTip = (tipArr, callback) => {
    var tipArr = tipArr;
    var isTip = false;
    for (var i = 0; i < tipArr.length; i++) {
        let opt = tipArr[i] ? tipArr[i] : null;
        let opt_default = {
            verifyText: null,
            verifyText2: null,
            name: '',
            duration: 2000,
            tipText: '',
            icon: 'none',
            success: null
        };
        opt = opt ? Object.assign(opt_default, opt) : opt_default;
        var tipText = '';   //提示消息
        var isItemTip = false;  //是否提示
        switch (opt.name) {
            case 'empty':
                isItemTip = !opt.verifyText
                tipText = langData.empty[lang];
                break;
            case 'phone':
                isItemTip = !commonFn.phoneregFn(opt.verifyText)
                tipText = langData.phone[lang];
                break;
            case 'email':
                isItemTip = !commonFn.emailRegFn(opt.verifyText)
                tipText = langData.email[lang];
                break;
            case 'verifyCodeEmpty':
                isItemTip = opt.verifyText == ''
                tipText = langData.verifyCodeEmpty[lang];
                break;
            case 'password':
                isItemTip = opt.verifyText == ''
                tipText = langData.password[lang];
                break;
            case 'passwordAgain':
                isItemTip = opt.verifyText == ''
                tipText = langData.passwordAgain[lang];
                break;
            case 'passwordContrast':
                isItemTip = opt.verifyText != opt.verifyText2
                tipText = langData.passwordContrast[lang];
                break;
            case 'userName':
                isItemTip = opt.verifyText == ''
                tipText = langData.userName[lang];
                break;
            case 'park':
                isItemTip = !opt.verifyText
                tipText = langData.park[lang];
                break;
            case 'ent':
                isItemTip = !opt.verifyText
                tipText = langData.ent[lang];
                break;
            case 'name':
                isItemTip = !opt.verifyText
                tipText = langData.name[lang];
                break;
            case 'date':
                isItemTip = !opt.verifyText
                tipText = langData.date[lang];
                break;
            case 'time':
                isItemTip = !opt.verifyText
                tipText = langData.time[lang];
                break;
        }
        if (isItemTip) {
            isTip = true;
            tipText = opt.tipText ? opt.tipText : tipText;
            wx.showToast({ title: tipText, icon: opt.icon, duration: opt.duration });
            break;
        }
    }
    return isTip;

}

module.exports = formTip