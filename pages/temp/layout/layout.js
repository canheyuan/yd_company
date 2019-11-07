// pages/temp/layout/layout.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    //监听滚动判断是否显示返回顶部按钮
    onPageScroll(e) {
        //返回顶部按钮
        if (e.scrollTop > 800 && !this.data.backTopShow) {
            console.log('backTopShow:true')
            this.setData({ backTopShow: true });
        } else if (e.scrollTop < 800 && this.data.backTopShow) {
            console.log('backTopShow:false')
            this.setData({ backTopShow: false });
        }
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