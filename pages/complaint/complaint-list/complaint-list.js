const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js');
const listFn = require('../../../utils/list.js'); //通用列表函数

Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        tagList: [
            { name: '', type: 1, reach: 1, show: true },
            { name: '', type: 2, reach: 1, show: false },
            { name: '', type: 3, reach: 1, show: false }
        ],
        tagIndex:0,

        listInfo: {},   //列表数据
        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'complaint', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            var tagList = this.data.tagList
            tagList[0].name = res.tagName01[lang]
            tagList[1].name = res.tagName02[lang]
            tagList[2].name = res.tagName03[lang]
            this.setData({ tagList: tagList})
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
        this.setData({ [reachData]: Math.random()  });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        var reachObj = 'tagList[' + this.data.tagIndex + '].reach';
        this.setData({ [reachObj]: Math.random() + 1 });
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

})