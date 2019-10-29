const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型

        serveSlideList:[
            { img: 'https://www.5iparks.com/static/yuanding/images/services/serve_banner.jpg',link: '' },
            { img: 'https://www.5iparks.com/static/yuanding/images/services/serve_banner.jpg', link: '' },
            { img: 'https://www.5iparks.com/static/yuanding/images/services/serve_banner.jpg', link: '' },
            { img: 'https://www.5iparks.com/static/yuanding/images/services/serve_banner.jpg', link: '' },
        ],
        serveSlideIndex:0,

        serveMenuList:[ //服务菜单按钮
            { icon: '/images/services/s_ico01.png', title: '校园特色', link: '/pages/serve-list/serve-list' },
            { icon: '/images/services/s_ico02.png', title: '校园特色', link: '/pages/serve-list/serve-list' },
            { icon: '/images/services/s_ico03.png', title: '校园特色', link: '/pages/serve-list/serve-list' },
            { icon: '/images/services/s_ico04.png', title: '校园特色', link: '/pages/serve-list/serve-list' },
            { icon: '/images/services/s_ico05.png', title: '校园特色', link: '/pages/serve-list/serve-list' },
            { icon: '/images/services/s_ico06.png', title: '校园特色', link: '/pages/serve-list/serve-list' },
            { icon: '/images/services/s_ico07.png', title: '校园特色', link: '/pages/serve-list/serve-list' },
            { icon: '/images/services/s_ico08.png', title: '校园特色', link: '/pages/serve-list/serve-list' },
            { icon: '/images/services/s_ico09.png', title: '校园特色', link: '/pages/serve-list/serve-list' },
            { icon: '/images/services/s_ico10.png', title: '校园特色', link: '/pages/serve-list/serve-list' },
        ],

        recommendData:[
            { title: '商标注册服务', xiaoliang:'103',zixun:'112' ,price:'￥1000' ,y_price:'￥1200' },
            { title: '企业形象策划服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' },
            { title: '科技项目代理服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' },
            { title: '商标注册服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' }
        ],

        newsShow: true,
        newCount: 0,
        isEmpty: false,　　//为false表示内容为空
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'services', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    serveSlideChange(e){
        var curIndex = e.detail.current;
        this.setData({ serveSlideIndex: curIndex });
    },


    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {

    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {

    },

    //用户点击右上角分享
    onShareAppMessage: function () {

    },
})