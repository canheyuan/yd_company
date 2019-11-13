
const app = getApp(); //获取应用实例
Page({
    data: {
        policyData: null,
        domainUrl: app.globalData.domainUrl,

        langData: null,  //语言数据
        langType: '',    //语言类型
    },
    onLoad: function () {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'policyDetail',(res)=>{
            wx.setNavigationBarTitle({ title: res.applyTitle });
        });

        this.setData({
            policyData: wx.getStorageSync('policyData')
        })
    },

    //用户点击右上角分享
    onShareAppMessage: function () {
        
    }
})