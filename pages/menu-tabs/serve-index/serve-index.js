const app = getApp(); //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型

        //顶部幻灯片列表
        serveSlideList:null,
        serveSlideIndex:0,
        serveSlideFinish:false, //判断接口是否已经加载完成

        //服务菜单列表
        serveMenuList:null,
        serveMenuFinish: false, //判断接口是否已经加载完成

        //最近浏览
        browseList:null, 
        browseFinish: false,  //判断接口是否已经加载完成

        //推荐服务列表
        serveRecommendList:null,
        serveRecommendFinish: false, //判断接口是否已经加载完成
        
        //服务分类列表
        categoryList:null,
        categoryFinish:false,   

        //服务商列表
        supplierList: null,
        supplierFinish: false, //判断接口是否已经加载完成
        
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
        });
        this.reachFn();
    },

    //刷新页面数据
    reachFn(){
        this.getServeSlideFn(); //广告幻灯片列表
        this.getServeRecordFn();    //服务记录列表
        this.getServeListFn();  //服务菜单列表
        this.getRecommendListFn()   //推荐服务列表
        this.getSupplierListFn();   //服务商列表
        this.getServiceCategoryListFn() //推荐服务分类列表
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    //搜索服务
    searchServeFn(e){
        var serveVal = e.detail.value;
        if (!serveVal){
            wx.showToast({ title: '请输入搜索关键词', icon: 'none', duration: 2000 });
            return;
        }
        wx.navigateTo({ url: `/services/serve-list/serve-list?search=${serveVal}`} )
    },

    //获取广告数据
    getServeSlideFn() {
        app.requestFn({
            url: '/advert/list',
            data: {
                advertGroup: "service_market_index_carousel"
            },
            success: (res) => {
                var serveSlideList = res.data.data;
                serveSlideList.forEach(item => {
                    item.advertImg = item.advertImg ? item.advertImg : this.data.domainUrl + "/images/default/img_730_320.jpg"
                })
                this.setData({ 
                    serveSlideList: serveSlideList,
                    serveSlideFinish:true
                });
            }
        });
    },

    //幻灯片先记录，后跳转详情
    goToLink(e) {
        var _this = this;
        var slideItem = e.currentTarget.dataset.item;
        var gotoUrl = '';  //不同类型，跳转到不同的详情页
        switch (slideItem.targetType) {  //类型
            case 'notice':
                gotoUrl = '/pages/message/notice-details/notice-details?id=' + slideItem.targetAddress;
                break;
            case 'activity':
                gotoUrl = '/activity/activity-details/activity-details?id=' + slideItem.targetAddress;
                break;
            case 'news':
                gotoUrl = '/found/news-detail/news-detail?id=' + slideItem.targetAddress;
                break;
            case 'policy':
                gotoUrl = '/found/policy-detail/policy-detail?id=' + slideItem.targetAddress;
                break;
            case 'service':
                gotoUrl = '/services/serve-detail/serve-detail?id=' + slideItem.targetAddress;
                break;
            case 'url':
                gotoUrl = '/pages/common/web-view/web-view?url=' + slideItem.targetAddress;  //调换h5地址
                break;
        }
        if (!gotoUrl){return;}
        app.requestFn({
            url: `/advert/click?advertId=${slideItem.advertId}`,
            isLoading: false,
            method: 'POST',
            complete: (res) => {
                wx.navigateTo({ url: gotoUrl })
            }
        });
    },

    //幻灯片园点切换
    serveSlideChange(e){
        var curIndex = e.detail.current;
        this.setData({ serveSlideIndex: curIndex });
    },

    //服务记录列表
    getServeRecordFn(e) {
        var _this = this;
        app.requestFn({
            url: `/serviceRecord/list`,
            data: { num: 10 },
            success: (res) => {
                //console.log('服务记录：',res.data)
                var browseList = res.data.data;
                browseList.forEach(item=>{
                    item.createTime = item.createTime.substring(5,16)
                })
                _this.setData({ browseList: browseList })
            }
        });
    },
    //最近浏览 跳转服务详情页
    gotoServeDetailFn(e){
        var serveId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/services/serve-detail/serve-detail?id=${serveId}`,
        })
    },

    //获取服务一级列表数据
    getServeListFn() {
        var _this = this;
        app.requestFn({
            url: '/serviceCategory/list',
            data: { level: 1 },
            success: (res) => {
                var serveMenuList = res.data.data;
                serveMenuList.forEach(item=>{
                    item.link = `/services/serve-category/serve-category?id=${item.id}`;
                })
                _this.setData({
                    serveMenuList: serveMenuList,
                    serveMenuFinish: true
                })
            }
        });
    },

    //获取推荐服务列表数据
    getRecommendListFn() {
        var _this = this;
        app.requestFn({
            url: '/serviceInfo/recoList',
            data: { num: 4 },
            success: (res) => {
                //console.log('首页推荐服务列表：',res.data)
                var serveRecommendList = res.data.data;
                serveRecommendList.forEach(item => {
                    item.link = `/services/serve-detail/serve-detail?id=${item.id}`;
                })
                _this.setData({
                    serveRecommendList: serveRecommendList,
                    serveRecommendFinish: true
                })
            }
        });
    },

    //查询推荐的服务分类列表
    getServiceCategoryListFn() {
        var _this = this;
        app.requestFn({
            url: '/serviceCategory/recoList',
            data: { serviceNum: 4 },
            success: (res) => {
                //console.log('查询推荐的服务分类列表', res.data)
                var categoryList = res.data.data;
                _this.setData({
                    categoryList: categoryList,
                    categoryFinish: true
                })
            }
        });
    },
    
    //获取服务商列表
    getSupplierListFn() {
        var _this = this;
        app.requestFn({
            url: '/serviceSupplier/recoList',
            data: { num: 2 },
            success: (res) => {
                //console.log('服务商列表：',res.data)
                var supplierList = res.data.data;
                supplierList.forEach(item => {
                    item.star = parseInt(item.star);
                    item.link = `/services/supplier-list/supplier-list?id=${item.id}`;
                })
                _this.setData({
                    supplierList: supplierList,
                    supplierFinish: true
                })
            }
        });
    },



    //监听滚动判断是否显示返回顶部按钮
    onPageScroll(e) {
        if (e.scrollTop > 800 && !this.data.backTopShow) {
            this.setData({ backTopShow: true });
        } else if (e.scrollTop < 800 && this.data.backTopShow) {
            this.setData({ backTopShow: false });
        }
    },


    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {
        this.reachFn();
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {

    },

    //用户点击右上角分享
    onShareAppMessage: function () {

    },
})