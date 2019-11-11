const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型
        tagList: [  //订单状态（1-待确认 2-待交付 3-待验收 4-待评价 5-已评价 6-已取消）
            { name: '全部', type: '', reach: 1, show: true },
            { name: '待确认', type: 1, reach: 1, show: false },
            { name: '待交付', type: 2, reach: 1, show: false },
            { name: '待验收', type: 3, reach: 1, show: false },
            { name: '待评价', type: 4, reach: 1, show: false },
            { name: '已完成', type: 5, reach: 1, show: false },
            { name: '取消/售后', type: 6, reach: 1, show: false }
        ],
        tagIndex: 0,
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'services', (res) => {
            //wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
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