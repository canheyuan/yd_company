const app = getApp(); //获取应用实例

//取消收藏提示和接口地址
var tipData = null

Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        moduleSwitch: app.globalData.moduleSwitch,
        isPopShow: false,  //弹窗是否显示
        currentTagName: 'policy',  //默认显示哪个模块（policy、news、acitvity、expert）
        reachData: {
            news: 1,
            activity: 1,
            policy: 1,
            expert: 1,
        },
        popTipTitle: "", //取消收藏提示title
        currentId: '',  //取消收藏id

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'collect', (res) => {

            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title

            tipData = {
                activity: {
                    name: res.actName, jk_url: '/activityCollection/remove/',
                },
                news: {
                    name: res.newsName, jk_url: '/newsCollection/remove/',
                },
                policy: {
                    name: res.policyName, jk_url: '/policyCollection/remove/',
                },
                expert: {
                    name: res.expertName, jk_url: '/expertAttention/remove/',
                }
            }

        });


    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {
        //动态赋予一个随机数触发组件上拉加载下一页函数
        var reachObj = 'reachData.' + this.data.currentTagName
        this.setData({
            [reachObj]: Math.random()
        });
        console.log(this.data.reachData)
    },

    //选项卡切换
    tagChange(e) {
        this.setData({
            currentTagName: e.currentTarget.dataset.name
        });
    },

    //显示弹窗
    collectPopShowFn(e) {
        this.setData({
            popTipTitle: tipData[e.detail.type].name,
            currentId: e.detail.id,
            isPopShow: true
        })
    },

    //关闭弹窗
    collectPopHideFn() {
        this.setData({
            isPopShow: false
        });
    },

    //取消收藏操作
    deleteCollectFn() {
        var _this = this;
        app.requestFn({
            isLoading: false,
            url: tipData[_this.data.currentTagName].jk_url + _this.data.currentId,
            method: 'DELETE',
            success: (res) => {

                wx.showToast({ title: '已取消收藏', icon: 'none', duration: 2000 });
                _this.collectPopHideFn();
                var reachObj = "reachData." + _this.data.currentTagName;
                _this.setData({
                    [reachObj]: Math.random() + 1
                })

            }
        });
    }

})