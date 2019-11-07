const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型

        //顶部幻灯片列表
        serveSlideList:[
            { img: 'https://www.5iparks.com/static/yuanding/images/services/serve_banner.jpg',link: '' },
            { img: 'https://www.5iparks.com/static/yuanding/images/services/serve_banner.jpg', link: '' },
            { img: 'https://www.5iparks.com/static/yuanding/images/services/serve_banner.jpg', link: '' },
            { img: 'https://www.5iparks.com/static/yuanding/images/services/serve_banner.jpg', link: '' },
        ],
        serveSlideIndex:0,
        serveSlideFinish:false, //判断接口是否已经加载完成

        //服务菜单列表
        serveMenuList:null,
        serveMenuFinish: false, //判断接口是否已经加载完成

        browseList:null,    //浏览列表
        browseFinish: false,  //判断接口是否已经加载完成


        //推荐服务列表
        serveRecommendList:null,
        serveRecommendFinish: false, //判断接口是否已经加载完成

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

    reachFn(){
        this.getServeListFn();  //服务菜单列表
        this.getRecommendListFn()   //推荐服务列表
        this.getSupplierListFn();   //服务商列表
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    serveSlideChange(e){
        var curIndex = e.detail.current;
        this.setData({ serveSlideIndex: curIndex });
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
                    item.link = `/pages/services/serve-category/serve-category?id=${item.id}`;
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
                console.log('首页推荐服务列表：',res.data)
                var serveRecommendList = res.data.data;
                serveRecommendList.forEach(item => {
                    item.link = `/pages/services/serve-detail/serve-detail?id=${item.id}`;
                })
                _this.setData({
                    serveRecommendList: serveRecommendList,
                    serveRecommendFinish: true
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
                console.log('服务商列表：',res.data)
                var supplierList = res.data.data;
                supplierList.forEach(item => {
                    item.link = `/pages/services/supplier-list/supplier-list?id=${item.id}`;
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
            console.log('backTopShow:true')
            this.setData({ backTopShow: true });
        } else if (e.scrollTop < 800 && this.data.backTopShow) {
            console.log('backTopShow:false')
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