//获取应用实例
const app = getApp()
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,

        serveData:{},
        levelId:'',

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function (options) {
        
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve', (res,lang) => {
            wx.setNavigationBarTitle({ title: res.categoryTitle[lang] });  //设置当前页面的title
        });

        //判断是否有缓存，有直接加载缓存不调用接口
        var serveData = wx.getStorageSync('serveCategory') ? wx.getStorageSync('serveCategory'):null;
        if (!serveData){
            this.setData({ levelId: options.id ? options.id:'' });
            this.getlistInfoFn(1);
        }else{
            var levelId = options.id ? options.id: serveData.level1[0].id
            this.setData({
                serveData : serveData,
                levelId : levelId
            })
        }
    },

    //选项卡切换
    tagChangeFn(e) {
        var id = e.currentTarget.dataset.id;
        this.setData({ levelId: id });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.getlistInfoFn(1);
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //获取服务数据
    getlistInfoFn(level) {
        var _this = this;
        app.requestFn({
            isLoading: level,
            url: '/serviceCategory/list',
            data:{
                level:level
            },
            success: (res) => {
                var serveData = _this.data.serveData
                serveData['level'+level] = res.data.data
                this.setData({ serveData: serveData })
                if(level<3){
                    if (serveData.level1.length==0){ return }    //没有一级类目就不用继续加载
                    _this.getlistInfoFn(level + 1)
                } else {
                    wx.setStorageSync('serveCategory', _this.data.serveData) //设置缓存用户信息
                    if (!_this.data.levelId) {
                        this.setData({ levelId: serveData.level1[0].id })
                    }
                }
            }
        })
    },

    //跳转
    gotoSeverListFn(e) {
        var id = e.currentTarget.dataset.id
        var title = e.currentTarget.dataset.title
        wx.navigateTo({
            url: `/services/serve-list/serve-list?c_id=${id}&title=${title}`
        })
    }

})