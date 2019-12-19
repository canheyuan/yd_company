const app = getApp(); //获取应用实例
const formTip = require('../../../utils/validateForm.js');   //验证
const commonFn = require('../../../utils/common.js'); //一些通用的函数
var WxParse = require('../../../wxParse/wxParse.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null,  //详情数据
        hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
        hours_start: [],    //下拉开始时间集
        hours_end: [],      //下拉结束时间集

        startTime: '',//默认起始时间  
        endTime: '',//默认结束时间 
        
        moreDes: false,
        dateUrl: '', //地址传过来的日期

        veneuTime: 0,   //预定时间
        veneuMoney:0,   //需支付金额

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'reserve', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.reserveTitle[lang] });  //设置当前页面的title
        });
        
        this.setData({ dateUrl: options.date });
        this.getDetailsFn(options.id);

    },

    //获取详情页数据
    getDetailsFn(chamberId) {
        var _this = this;
        var hourList = this.data.hours;
        app.requestFn({
            url: `/chamber/detail/${chamberId}`,
            success: (res) => {
                var detailsData = res.data.data
                detailsData.serviceTagList = detailsData.serviceTags ? detailsData.serviceTags.split(',') : null;  //标签
                WxParse.wxParse('description', 'html', detailsData.description, _this, 0);
                var hours = hourList.filter((item, i) => {  //获取可预订的时间段
                    return (i >= detailsData.availableStart && i <= detailsData.availableEnd)
                })
                var hours_start = hours.map(item=>{
                    return item + ':00'
                })
                var hours_end = hours.map(item => {
                    return item + ':59'
                })

                _this.setData({
                    hours_start: hours_start,
                    hours_end: hours_end,
                    detailsData: detailsData
                });
            }
        });
    },

    // 时间段选择
    bindTimeChange(e) {
        var langData = this.data.langData
        var lang = this.data.lang

        var changeType = e.currentTarget.dataset.type;
        if (changeType=='starttime'){
            var timehour = this.data.hours_start[e.detail.value];
            this.setData({ startTime: timehour });
        } else if(changeType == 'endtime'){
            var timehour = this.data.hours_end[e.detail.value];
            this.setData({ endTime: timehour });
        }

        var datas = this.data;
        var s_time = commonFn.getTimes(datas.dateUrl + ' ' + datas.startTime + ':00');
        var e_time = commonFn.getTimes(datas.dateUrl + ' ' + datas.endTime + ':00');

        if (s_time && e_time) {
            if (s_time > e_time) {
                wx.showToast({ title:langData.timeTip[lang], icon: 'none', duration: 3000 });
                return;
            }
            var hours = Math.ceil((e_time - s_time) / 1000 / 60 / 60);
            this.setData({ veneuTime: hours });
            this.getMoney();
        }
    },

    //计算支付金额
    getMoney(){
        var _this = this;
        var datas = this.data;
        var s_time = datas.dateUrl + ' ' + datas.startTime + ':00';
        var e_time = datas.dateUrl + ' ' + datas.endTime + ':00';
        app.requestFn({
            url: `/chamber/calAmount`,
            isLoading:false,
            data:{
                chamberId: _this.data.detailsData.chamberId,   //场地id
                orderStart: s_time,  //开始时间
                orderEnd: e_time,    //结束时间
                surcharge: ''    //附加费用
            },
            success: (res) => {
                _this.setData({ veneuMoney: res.data.data });
            }
        });
    },

    

    //展开收缩详细信息
    checkMoreFn: function () {
        console.log(this.data.moreDes);
        this.setData({
            moreDes: !this.data.moreDes
        });
    },

    //提交预定场地
    formSubmit(e) {
        var langData = this.data.langData
    var lang = this.data.lang

        var formId = e.detail.formId;
        var formData = e.detail.value;

        //验证
        var isTip = formTip([
            { name: 'empty', verifyText: this.data.startTime, tipText: langData.timeTip1[lang] },
            { name: 'empty', verifyText: this.data.endTime, tipText: langData.timeTip2[lang] },
            { name: 'empty', verifyText: formData.contact, tipText: langData.public.contactTip[lang] },
            { name: 'phone', verifyText: formData.phone, tipText: langData.public.contactPhoneTip[lang]},
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序
        
        formData.orderStart = formData.orderStart + ":00";
        formData.orderEnd = formData.orderEnd + ":00";

        //提交formId
        app.getFormIdFn(formId, () => {
            app.requestFn({
                isLoading: false,
                url: `/chamber/order`,
                header: 'application/x-www-form-urlencoded',
                data: formData,
                method: 'POST',
                success: (res) => {
                    wx.redirectTo({ url: '/pages/common/result/result?page=venue' })
                }
            });
        })
    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        console.log('图片加载失败', e.currentTarget.dataset.obj)
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

    //转发
    onShareAppMessage: function () {

    }
})