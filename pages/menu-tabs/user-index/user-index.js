const commonFn = require('../../../utils/common.js'); //一些通用的函数
const app = getApp();  //获取应用实例
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        moduleSwitch: null,
        menuList: null, //菜单列表
        userInfo: null,  //用户信息
        isLoginPopHide: true, //是否有用户信息
        isRecommendInfo: false, 

        pickerLang: {
            list: ['中文', 'English'],
            index: 0
        },

        langData: null,  //语言数据
        langType: '',    //语言类型
    },


    //加载菜单列表
    menuListFn() {
        var moduleSwitch = app.globalData.moduleSwitch;
        var langData = this.data.langData;
        var lang = this.data.lang;
        var recommendShow = (moduleSwitch.recommend && (this.data.isRecommendInfo == 1));

        var loginInfo = app.globalData.loginInfo;
        if (loginInfo) {
            //获取用户信息后判断是否是园区管家或管理员，是的话就显示账单查询
            var bOrder = loginInfo.userInfo.parkKeeper || loginInfo.userInfo.entAdmin;
        }
        var menuList = [
            { title: langData.couponBtn[lang], ico_class: 'ico_coupon', link: '/pages/coupon/my-coupon-list/my-coupon-list', isShow: moduleSwitch.coupon,isLast:true },
            { title: langData.collectBtn[lang], ico_class: 'ico_gz', link: '/pages/user/my-collect/my-collect', isShow: true, isLast: false },
            { title: langData.activityBtn[lang], ico_class: 'ico_act', link: '/pages/user/my-activity/my-activity', isShow: moduleSwitch.activity, isLast: false },
            { title: langData.orderBtn[lang], ico_class: 'ico_order', link: '/pages/order/order-list/order-list', isShow: moduleSwitch.order && bOrder, isLast: false},
            { title: langData.borrowedBtn[lang], ico_class: 'ico_wz', link: '/pages/supplies/borrowed-record/borrowed-record', isShow: moduleSwitch.supplies, isLast: false},
            { title: langData.serveBtn[lang], ico_class: 'ico_serve', link: '/pages/services/serve-order-list/serve-order-list', isShow: moduleSwitch.serve, isLast: false },
            { title: langData.complaintBtn[lang], ico_class: 'ico_complaint', link: '/pages/complaint/complaint-list/complaint-list', isShow: moduleSwitch.complaint, isLast: true},
            { title: langData.recommendBtn2[lang], ico_class: 'ico_recommend', link: '/pages/recommend/recommend-record/recommend-record', isShow: recommendShow, isLast: true},

            // { title: langData.changeGardenBtn[lang], ico_class: 'ico_garden', link: '/pages/common/change-garden/change-garden', isShow: true },
            // { title: langData.discussBtn[lang], ico_class: 'ico_discuss', link: '', isShow: true },
        ];
        this.setData({
            moduleSwitch: moduleSwitch,
            menuList: menuList
        });
    },

    //生命周期函数--监听页面显示
    onShow: function () {
        //保存当前页面地址，登录页后回到这个页面
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'switchTab' };
        wx.setStorageSync('backUrl', backUrl);

        //判断是否重新加载我的页面信息
        if (app.globalData.userIndexReach) {
            app.globalData.userIndexReach = false;
            this.reachFn();
        }
    },

    //刷新
    reachFn(){
        
        var _this = this;
        var langIndex = wx.getStorageSync('langtype') == 'en' ? 1 : 0;
        this.setData({ ['pickerLang.index']: langIndex });

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'userIndex', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });

        if (!app.globalData.isLogin) {
            _this.setData({ isLoginPopHide: false }); //弹出提示登录弹窗
        } else {
            _this.setData({
                userInfo: app.globalData.loginInfo.userInfo,
                isLoginPopHide: true
            });
            _this.isParkInfo(() => {
                this.menuListFn();     //加载菜单
            });
        }
    },

    //判断当前园区是否有房源分销信息
    isParkInfo(callback) {
        var _this = this;
        app.requestFn({
            isLoading: false,
            url: `/houseDistribution/onDist`,
            success: (res) => {
                _this.setData({ isRecommendInfo: res.data.data });
                callback && callback(res.data.data);
            }
        });
    },

    //切换语言
    changeLangFn(e) {
        var index = e.detail.value;
        this.setData({ ['pickerLang.index']: index });
        var langType = index == 1 ? 'en' : 'zh';
        if (langType == app.globalData.lang) {   //如果语言没改变，就不执行下面的
            return;
        }
        if (langType == 'en') {
            wx.hideTabBar();
        } else {
            wx.showTabBar();
        }
        app.globalData.langType = langType
        app.globalData.lang = langType
        wx.setStorageSync('langtype', langType);
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'userIndex', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.menuListFn();
        });

        //重置所有刷新状态
        app.resetAllReach();
    },

    //提示
    fapiaoTip() {
        var lang = app.globalData.lang
        wx.showToast({ title: this.data.langData.buildBtn[lang], icon: 'none', duration: 3000 });
    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.reachFn();
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },
})