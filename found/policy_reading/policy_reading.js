
const app = getApp(); //获取应用实例
Page({
    data: {
        policyData: null,
        domainUrl: app.globalData.domainUrl,

        langData: null,  //语言数据
        lang: '',    //语言类型
    },
    onLoad: function () {

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'policyDetail', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.applyTitle[lang] });
        });

        this.setData({ policyData: wx.getStorageSync('policyData') })
    }
})