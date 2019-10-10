

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
        langType: '',    //语言类型
    },

    onLoad: function () {
        this.getAreaList();

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'foundIndex', (res) => {
            wx.setNavigationBarTitle({ title: res.expertTitle });  //设置当前页面的title
        });
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function (e) {
        //动态赋予一个随机数触发组件上拉加载下一页函数
        this.setData({ reachData: Math.random() })
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
    },
})
