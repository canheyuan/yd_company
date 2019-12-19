const app = getApp();  //获取应用实例
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        carDetail:null
    },
    
    onLoad: function (options) {
        var carDetail = wx.getStorageSync('carDetail')
        if(!carDetail){
            this.getParkingMonthlyFn(options.code)
        }else{
            this.dataTidy(carDetail)
            wx.removeStorageSync('carDetail')
        }
    },

    //车牌查询月保信息
    getParkingMonthlyFn(carPlate) {
        app.requestFn({
            url: `/parkingMonthly/detail/${carPlate}`,
            success: (res) => {
                var carDetail = res.data.data;
                this.dataTidy(carDetail)
            }
        });
    },

    dataTidy(carDetail){
        var carDetail = carDetail
        carDetail.expiredDate = carDetail.expiredDate?carDetail.expiredDate.substring(0,11):'未交费'
        switch(carDetail.status){
            case 1:
                carDetail.statusName = '正常'
                carDetail.statusClass = 'green'
                break;
            case 2:
                carDetail.statusName = '停用'
                carDetail.statusClass = 'red'
                break;
            case 3:
                carDetail.statusName = '已到期'
                carDetail.statusClass = 'red'
                break;
        }
        this.setData({carDetail : carDetail}) 
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})