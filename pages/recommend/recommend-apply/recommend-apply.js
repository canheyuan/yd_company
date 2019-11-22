const app = getApp();    //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const formTip = require('../../../utils/validateForm.js');   //验证
var countGetCodeTimer = null;

Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        phone: '', //手机号输入框

        dateValue: null,  //选择的日期
        timeValue: null,  //选择的时间
        distId: '',  //分销Id
        shareId: '', //分享id

        langData: null,  //语言数据
        lang: '',    //语言类型

    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'recommend', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });

        this.setData({
            distId: options.dist_id,
            shareId: options.share_id
        })

    },

    //通用下拉选择方法
    selectFn(e) {
        var indexName = e.currentTarget.dataset.indexname;  //当前下拉选择定义的索引字段
        this.setData({ [indexName]: e.detail.value });
    },

    //输入时动态获取手机号码
    changePhoneFn(e) {
        this.setData({ phone: e.detail.value });
    },


    //确认提交预约
    formSubmit(e) {
        var _this = this;
        var formData = e.detail.value;
        var formId = e.detail.formId;

        //验证
        var isTip = formTip([
            { name: 'name', verifyText: formData.name },
            { name: 'phone', verifyText: formData.phone },
            { name: 'date', verifyText: _this.data.dateValue },
            { name: 'time', verifyText: _this.data.timeValue },
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序
        formData['reseTimeStr'] = _this.data.dateValue + ' ' + _this.data.timeValue + ':00';  //预约时间
        formData['distId'] = _this.data.distId;  //分销id
        formData['shareId'] = _this.data.shareId //分享id

        //提交预约信息
        app.requestFn({
            url: `/houseDistribution/reserve`,
            header: 'application/x-www-form-urlencoded',
            data: formData,
            method: 'POST',
            success: (res) => {
                wx.navigateTo({ url: '/pages/common/result/result?page=recommend' });
            }
        });

    }
})


