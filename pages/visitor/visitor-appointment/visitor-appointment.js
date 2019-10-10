

const app = getApp(); //获取应用实例
const commonFn = require('../../../utils/common.js');
var regionFn = require('../../../utils/region-data.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        visitorData: null, //初始化信息
        roomIndex: null,  //选择的房间索引
        dateValue: null,  //选择的日期
        timeValue: null,  //选择的时间

        langData: null,  //语言数据
        langType: '',    //语言类型

    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'visitor', (res) => {
            wx.setNavigationBarTitle({ title: res.visitorAppointmentTitle });  //设置当前页面的title
        });

        this.getVisitorInfoFn();
    },

    //通用下拉选择方法
    selectFn(e) {
        var indexName = e.currentTarget.dataset.indexname;  //当前下拉选择定义的索引字段
        this.setData({ [indexName]: e.detail.value });
    },

    //获取基本信息
    getVisitorInfoFn() {
        app.requestFn({
            url: `/visitorReservation/initInfo`,
            success: (res) => {
                var datas = res.data.data;
                datas.address = regionFn.regionData(datas.provinceId) + regionFn.regionData(datas.cityId) + (datas.address ? datas.address : ''); //拼地址
                datas.roomList = [];  //将对象的房间转为数组，方便引用
                Object.keys(datas.rooms).forEach(key => {
                    datas.roomList.push({ roomId: key, roomName: datas.rooms[key] });
                });
                console.log("访客预约初始化信息：", datas);
                this.setData({ visitorData: datas });
            }
        });
    },

    //提交预约
    submitFn(e) {
        var langData = this.data.langData;
        var visitorData = this.data.visitorData;
        var formDatas = e.detail.value;

        if (formDatas.visitorName == '') {
            wx.showToast({ title: langData.vNameTip, icon: 'none', duration: 2000 });
            return;
        }
        if (!commonFn.phoneregFn(formDatas.visitorPhone)) {
            wx.showToast({ title: langData.vPhoneTip, icon: 'none', duration: 2000 });
            return;
        }
        if (!this.data.roomIndex) {
            wx.showToast({ title: langData.vFloorTip, icon: 'none', duration: 2000 });
            return;
        }
        if (!this.data.dateValue) {
            wx.showToast({ title: langData.vDateTip, icon: 'none', duration: 2000 });
            return;
        }
        if (!this.data.timeValue) {
            wx.showToast({ title: langData.vTimeTip, icon: 'none', duration: 2000 });
            return;
        }

        formDatas.address = visitorData.address;
        formDatas.reserveTime = this.data.dateValue + " " + this.data.timeValue + ":00";
        formDatas.unitId = visitorData.roomList[this.data.roomIndex].roomId;

        app.requestFn({
            url: `/visitorReservation/add`,
            data: formDatas,
            header: 'application/x-www-form-urlencoded',
            method: "POST",
            success: (res) => {
                console.log("提交预约成功：", res);
                wx.navigateTo({ url: '/pages/visitor/visitor-success/visitor-success?id=' + res.data.data }); //跳转成功页
            }
        });

    },

    //调起扫码
    scanFn(e) {
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                console.log('扫码成功：', res);

                var result = JSON.parse(res.result);
                var goUrl = '/pages/visitor/visitor-operation/visitor-operation?id=' + result.business_id;
                wx.navigateTo({ url: goUrl });
            }
        });
    }

})