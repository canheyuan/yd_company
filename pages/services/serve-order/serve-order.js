const app = getApp(); //获取应用实例
const formTip = require('../../../utils/validateForm.js');   //验证

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        lang: '',    //语言类型
        userInfo: null,
        serveId: '', //4e31b88314367e857a78bbac4147307b
        detailData:null,
        payNum : 1, //购买数量
        statementShow :false,    //服务声明是否显示
        smData: null   //服务声明数据
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve');

        //获取缓存详情信息
        var detailData = wx.getStorageSync('serveDetail') ? wx.getStorageSync('serveDetail'):null; 
        this.setData({
            userInfo: app.globalData.loginInfo.userInfo,
            detailData: detailData,
            serveId: detailData.id
        })

        this.getShengmingFn();
    },

    //获取声明信息
    getShengmingFn() {
        wx.request({
            url: 'https://5iparks.com/static/guest/json/shengming.json',
            method: 'GET',
            dataType: 'json',   //数据返回类型
            success: (res) => {
                console.log('getjsFn', res.data)
                this.setData({ smData: res.data })
            }
        })
    },

    //获取详情
    getDetailFn(id) {
        var _this = this;
        app.requestFn({
            url: `/serviceInfo/detail/${id}`,
            success: (res) => {
                console.log('服务详情：', res.data)
                var detailData = res.data.data;
                detailData.supplier.star = parseInt(detailData.supplier.star);
                WxParse.wxParse('description', 'html', detailData.description, _this, 0);
                this.setData({ detailData: detailData });
                wx.setNavigationBarTitle({ title: detailData.name });  //设置当前页面的title
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

        formData['serviceId'] = this.data.serveId
        formData['count'] = this.data.payNum

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
                url: `/serviceOrder/createOrder`,
                header: 'application/x-www-form-urlencoded',
                data: formData,
                method: 'POST',
                success: (res) => {
                    //console.log('下单成功')
                    wx.redirectTo({ url: '/pages/common/result/result?page=serveOrder' })
                }
            });
        })
    },

    //服务声明弹窗打开关闭
    statementPopFn(e){
        this.setData({ statementShow: !this.data.statementShow })
    }
})