
const app = getApp();
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        detailData: null,

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        console.log('options',options)
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'activity', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.actApplayTitle[lang] });  //设置当前页面的title
        });
        this.getActivityUserInfo(options.id)
    },

    //获取用户信息
    getActivityUserInfo(activityId) {
        app.requestFn({
            url: `/activityUser/initInfo`,
            data: {
                activityId: activityId
            },
            success: (res) => {
                console.log("用户信息", res.data.data);
                this.setData({ detailData: res.data.data });
            }
        });
    },

    //提交报名
    submitFn(e) {
        var _this = this;
        var formId = e.detail.formId;
        var activityId = _this.data.detailData.activityId;
        
        app.getFormIdFn(formId, () => {
            app.requestFn({
                isLoading: false,
                url: `/activityUser/add`,
                header: 'application/x-www-form-urlencoded',
                data: {
                    activityId: activityId,
                },
                method: 'POST',
                success: (res) => {
                    wx.redirectTo({
                        url: '/pages/common/result/result?page=activity&id=' + activityId
                    })
                }
            });
        })

    }

})