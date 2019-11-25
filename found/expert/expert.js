

const app = getApp();  //获取应用实例
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        areaList: null,
        currentTagName: 0,
        expertType: null,
        navWidth: 0,
        reachData: null,  //随机数，只要数值改了，列表就会刷新

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function () {
        this.getAreaList();

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'foundIndex', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.expertTitle[lang] });  //设置当前页面的title
        });
    },

    onShow(){
        //专家列表是否刷新
        if (app.globalData.expertReach) {
            this.setData({ reachData: Math.random() + 1 });
        }
    },

    //页面上拉加载更多数据
    onReachBottom: function (e) {
        this.setData({ reachData: Math.random() })
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.setData({ reachData: Math.random()+1 })
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
    
    //行业类型选项卡切换
    tagChange(e) {
        var index = e.currentTarget.dataset.index;
        var areaId = e.currentTarget.dataset.id;
        this.setData({
            currentTagName: index,
            expertType: areaId,
            reachData: Math.random() + 1
        });
    },

    //加载领域列表
    getAreaList() {
        app.requestFn({
            url: '/expert/areaList',
            success: (res) => {
                var areaList = res.data.data;
                this.setData({
                    areaList: areaList,
                    navWidth: areaList.length * 220,
                    expertType: areaList[0].areaId,
                    reachData: Math.random() + 1
                })
            }
        });
    }
})
