const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型

        serveId: '', //4e31b88314367e857a78bbac4147307b
        detailData: null,
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve');

        //获取缓存详情信息
        var detailData = wx.getStorageSync('serveDetail') ? wx.getStorageSync('serveDetail') : null;
        this.setData({
            detailData: detailData,
            serveId: detailData.id
        })
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    //提交咨询
    formSubmit(e) {
        var _this = this;
        var formData = e.detail.value;
        var formId = e.detail.formId;

        formData['serviceId'] = this.data.serveId

        //验证
        var isTip = formTip([
            { name: 'name', verifyText: formData.contact },
            { name: 'phone', verifyText: formData.contactPhone }
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序
        console.log('formData', formData)
        app.getFormIdFn(formId, () => { //获取formid
            //提交注册数据
            app.requestFn({
                url: ``,
                header: 'application/x-www-form-urlencoded',
                data: formData,
                method: 'POST',
                success: (res) => {
                    wx.redirectTo({ url: '/pages/common/result/result?page=serveConsult' })
                }
            });
        })
    },
})