const app = getApp()    //获取应用实例
const commonFn = require('../../../utils/common.js');   //一些通用的函数

Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        isIndexBtnShow: false,  //是否显示返回首页按钮
        tagList: [
            { name: '', type: 1, reach: 1, show: true },
            { name: '', type: 2, reach: 1, show: false },
            { name: '', type: 3, reach: 1, show: false }
        ],
        tagIndex: 0,
        reachData: [1, 1, 1],

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {
        if (options.from == 'ma_msg') {
            this.setData({ isIndexBtnShow: true });
        }
        if (options.tag){
            this.setData({ tagIndex: options.tag ? options.tag:0 });
        }

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'reserve', (res) => {
            wx.setNavigationBarTitle({ title: res.reserveTitle });  //设置当前页面的title
            var tagList = this.data.tagList;
            tagList[0].name = res.tagName1;
            tagList[1].name = res.tagName2;
            tagList[2].name = res.tagName3;
            this.setData({ tagList: tagList })
        });
    },

    //选项卡切换
    tagChangeFn(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            ['tagList[' + index + '].show']: true,
            tagIndex: index
        });
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function (e) {
        //动态赋予一个随机数触发组件上拉加载下一页函数
        var reachData = 'tagList[' + this.data.tagIndex + '].reach';
        this.setData({
            [reachData]: Math.random()
        });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        var reachObj = 'tagList[' + this.data.tagIndex + '].reach';
        this.setData({ [reachObj]: Math.random() + 1 });
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },
})