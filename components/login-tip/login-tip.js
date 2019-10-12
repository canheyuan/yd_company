
const app = getApp(); //获取应用实例
const commonFn = require('../../utils/common.js');   //一些通用的函数
Component({
    //组件的属性列表
    properties: {
        closeBtnShow: Boolean,
    },

    //组件的初始数据
    data: {
        isShow: true,
        closeBtnShow: false
    },

    //组件加载完成后
    attached() {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'cpLoginTip');

        this.setData({
            closeBtnShow: this.properties.closeBtnShow ? this.properties.closeBtnShow : false
        });
    },

    //组件的方法列表
    methods: {
        //关闭弹窗
        closePopFn() {
            this.triggerEvent('closePop');
        },

        //获取用户信息
        getUserInfoFn(e) {
            this.closePopFn();
            wx.showLoading({ title: this.data.langData.public.loadingTip, mask: true });
            var _this = this;
            console.log("组件获取用户信息：", e.detail);
            wx.removeStorageSync('userInfo'); //清除之前缓存
            var page = e.currentTarget.dataset.page; //跳转页面

            app.getWxLoginInfo(function () {

                var gotoUrl = '';
                if (page == 'login') {
                    gotoUrl = '/pages/common/login/login'
                } else if (page == 'register') {
                    gotoUrl = '/pages/common/register/register'
                }
                wx.navigateTo({ url: gotoUrl });
                wx.hideLoading();
            });
        },
    }
})
