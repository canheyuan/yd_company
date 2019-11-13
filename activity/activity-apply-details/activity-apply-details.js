
const app = getApp();   //APP实例
Page({

    //页面的初始数据
    data: {
        detailData: null,
        isIndexBtnShow: false,
        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        if (options.from == 'ma_msg') {
            this.setData({ isIndexBtnShow: true });
        }

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'activity', (res) => {
            wx.setNavigationBarTitle({ title: res.checkApplyTitle });  //设置当前页面的title
        });
        this.getActivityUserInfo(options.id)
    },

    //获取用户信息
    getActivityUserInfo(id) {
        app.requestFn({
            url: `/activityUser/detail/${id}`,
            success: (res) => {
                this.setData({ detailData: res.data.data });
            }
        });
    }
})