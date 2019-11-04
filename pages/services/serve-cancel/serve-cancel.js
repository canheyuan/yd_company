const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型
        
        fileImgs: [],  //上传图片
        fileImgsNum: 3,  //可以上传的图片个数，最多三张
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

    //选择图片
    fileImageFn() {
        var _this = this;
        app.chooseImg({
            count: _this.data.fileImgsNum,
            success: (res) => {
                var tempFilePaths = res.tempFilePaths;
                var list = _this.data.fileImgs.concat(tempFilePaths);
                _this.setData({
                    fileImgsNum: _this.data.fileImgsNum - tempFilePaths.length,
                    fileImgs: list
                })
            }
        })
    },

    //删除预览图
    removeImageFn(e) {
        var removeIndex = e.currentTarget.dataset.index;
        var imgArr = this.data.fileImgs;
        imgArr.splice(removeIndex, 1);
        this.setData({
            fileImgsNum: 3 - imgArr.length,
            fileImgs: imgArr
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