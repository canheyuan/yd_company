const app = getApp();  //获取应用实例
Page({

    // 页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        carArr:[
            ["京", "津", "冀", "晋", "蒙", "辽", "吉", "黑", "沪", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "粤", "桂", "琼", "渝", "川", "黔", "滇", "藏", "陕", "甘", "青", "宁", "新", "台", "港", "澳"],
            ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        ],
        carIndex:[0,0],
        carCode1Text:'粤A',
        carCode2Text: '',

        carDeatail:null,    //车辆信息
        historyList:null,   //历史记录
    },

    onLoad: function (options) {
        this.getHistoryListFn() //历史记录
    },

    //车牌前缀改变时
    carCode1Fn(e){
        var carArr = this.data.carArr 
        var carIndex = e.detail.value 
        this.setData({ 
            carIndex: carIndex,
            carCode1Text: carArr[0][carIndex[0]] + carArr[1][carIndex[1]]
        })
    },

    //输入车牌号
    carCode2Fn(e){
        var value = e.detail.value
        this.setData({ carCode2Text: value.toUpperCase() })
    },

    //车牌查询月保信息
    getParkingMonthlyFn() {
        var carCode2Text = this.data.carCode2Text
        if(!carCode2Text || carCode2Text.length<5){
            wx.showToast({ title: '请输入正确的车牌号码', icon: 'none', duration: 2000 })
            return;
        }
        var carPlate = this.data.carCode1Text + carCode2Text
        app.requestFn({
            url: `/parkingMonthly/detail/${carPlate}`,
            success: (res) => {
                var carDetail = res.data.data;
                wx.setStorageSync('carDetail', carDetail)
                wx.navigateTo({ url: '/pages/parking/enquiry-detail/enquiry-detail' })
            }
        });
    },

    //获取历史记录
    getHistoryListFn() {
        app.requestFn({
            url: `/parkingMonthly/getSearchRecord`,
            success: (res) => {
                var historyList = res.data.data;
                this.setData({historyList : historyList})
            }
        });
    },

    //用户点击右上角分享
    onShareAppMessage: function () {

    }
})