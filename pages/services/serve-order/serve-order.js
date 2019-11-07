const app = getApp(); //获取应用实例
const formTip = require('../../../utils/validateForm.js');   //验证

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型
        
        detailData:null,
        payNum : 1, //购买数量

    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'services', (res) => {
            //wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    //获取详情
    getDetailFn(id) {
        var _this = this;
        app.requestFn({
            url: `${id}`,
            success: (res) => {
                var detailData = res.data.data;
                this.setData({ detailData: detailData });
            }
        })
    },

    //改变购买数量
    changeNumFn(e){
        var type = e.currentTarget.dataset.type
        var payNum = this.data.payNum
        payNum = (type == 'add') ? payNum + 1 : (payNum == 1 ? 1 : payNum - 1)
        console.log('payNum', payNum)
        this.setData({ payNum: payNum })
    },

    //提交订单
    formSubmit(e) {
        var _this = this;
        var formData = e.detail.value;
        var formId = e.detail.formId;

        //验证
        var isTip = formTip([
            { name: 'name', verifyText: formData.name },
            { name: 'phone', verifyText: formData.phone }
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序
        formData['serveNum'] = _this.data.payNum;

        app.getFormIdFn(formId, () => {
            //提交注册数据
            app.requestFn({
                url: ``,
                header: 'application/x-www-form-urlencoded',
                data: formData,
                method: 'POST',
                success: (res) => {

                }
            });
        })
    },

    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {

    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {

    },

    //用户点击右上角分享
    onShareAppMessage: function () {

    }
})