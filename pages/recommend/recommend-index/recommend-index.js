
const app = getApp();  //获取应用实例

Page({

    data: {
        domainUrl: app.globalData.domainUrl,

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'recommend', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.indexTitle[lang] });  //设置当前页面的title
        });
    }

})