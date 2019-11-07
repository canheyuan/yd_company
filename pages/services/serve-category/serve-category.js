//获取应用实例
const app = getApp()
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,

        serveData:{},
        levelId:'',

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {
        this.setData({ levelId: options.id });
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'services', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });
        this.getlistInfoFn(1);
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
                console.log('服务数据列表：'+ level + '级:' , res.data);
                var serveData = _this.data.serveData;
                serveData['level'+level] = res.data.data;
                this.setData({ serveData: serveData });
                if(level<3){
                    if (serveData.level1.length==0){ return }    //没有一级类目就不用继续加载
                    _this.getlistInfoFn(level + 1);
                } else if (!_this.data.levelId){
                    this.setData({ levelId: serveData.level1[0].id });
                }
                console.log('服务数据列表：', serveData);
            }
        });
    },

    //跳转
    gotoSeverListFn(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/services/serve-list/serve-list?c_id=${id}`
        })
    }

})