const app = getApp(); //获取应用实例

Page({

    data: {
        domainUrl: app.globalData.domainUrl
    },

    onLoad: function (options) {
        this.setData({
            userInfo: app.globalData.loginInfo.userInfo
        })
    }

})