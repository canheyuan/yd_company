const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        lang: '',    //语言类型
        tagList: null,  //订单状态type（1-待确认 2-待交付 3-待验收 4-待评价 5-已评价 6-已取消）
        tagIndex: 0,
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.orderListTitle[lang] });  //设置当前页面的title
            this.setData({
                tagList: [  //订单状态（1-待确认 2-待交付 3-待验收 4-待评价 5-已评价 6-已取消）
                    { name: res.orderStatus08[lang], type: '', reach: 1, show: true },
                    { name: res.orderStatus01[lang], type: 1, reach: 1, show: false },
                    { name: res.orderStatus02[lang], type: 2, reach: 1, show: false },
                    { name: res.orderStatus03[lang], type: 3, reach: 1, show: false },
                    { name: res.orderStatus04[lang], type: 4, reach: 1, show: false },
                    { name: res.orderStatus05[lang], type: 5, reach: 1, show: false },
                    { name: res.orderStatus07[lang], type: 6, reach: 1, show: false }
                ],
            })
        });
    },

    //生命周期函数--监听页面显示
    onShow: function () {
        if (app.globalData.serveOrderReach){
            var reachObj = 'tagList[' + this.data.tagIndex + '].reach';
            this.setData({ [reachObj]: Math.random() });
        }
    },

    //选项卡切换
    tagChangeFn(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            ['tagList[' + index + '].show']: true,
            tagIndex: index
        });
    },

    //上拉加载更多
    onReachBottom: function (e) {
        var reachObj = 'tagList[' + this.data.tagIndex + '].reach';
        this.setData({ [reachObj]: Math.random() });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        var reachObj = 'tagList[' + this.data.tagIndex + '].reach';
        this.setData({ [reachObj]: Math.random() + 1 });
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //监听滚动判断是否显示返回顶部按钮
    onPageScroll(e) {
        if (e.scrollTop > 800 && !this.data.backTopShow) {
            this.setData({ backTopShow: true });
        } else if (e.scrollTop < 800 && this.data.backTopShow) {
            this.setData({ backTopShow: false });
        }
    },
})