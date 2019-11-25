
const app = getApp(); //获取应用实例

Page({

    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        tagList: null,
        tagIndex: 0,  //选项卡索引
        tagScrollTop: 0, //选项卡与顶部的距离
        reach: [1, 1, 1],

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'order', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.setData({
                tagList: [
                    { name: res.orderTagName1[lang], type: 1 },
                    { name: res.orderTagName2[lang], type: 2 },
                    { name: res.orderTagName3[lang], type: 0 }
                ]
            })
        });

        this.queryMultipleNodes("#tag_box");
    },

    //获取元素与顶部的距离
    queryMultipleNodes: function (obj) {
        var _this = this;
        var query = wx.createSelectorQuery();
        query.select(obj).boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec(function (res) {
            _this.setData({
                tagScrollTop: res[0].top
            });
        })
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {
        this.setData({
            ['reach[' + this.data.tagIndex + ']']: Math.random()
        })
    },

    //选项卡切换
    tagChangeFn(e) {
        this.setData({
            tagIndex: e.currentTarget.dataset.index
        });
    }

})