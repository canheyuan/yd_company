const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型

        causeList:[
            '不想要这项服务',
            '服务下单后一直没有响应',
            '信息填写错误重新下单',
            '其他原因'
        ],
        causeIndex:-1,
        reason:'',
        orderId:'',

        fileImgs: [],  //上传图片
        fileImgsNum: 3,  //可以上传的图片个数，最多三张
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve', (res) => {
            //wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });

        this.setData({ orderId : options.id });
    },

    //选择取消原因
    chooseCauseFn(e){
        var index = e.currentTarget.dataset.index;
        var reason = index == 3 ? '' : this.data.causeList[index]
        this.setData({ 
            reason: reason,
            causeIndex: index
        })
    },

    //输入其他原因
    causeTextBlurFn(e){
        this.setData({ reason: e.detail.value })
    },

    //提交取消服务
    cancelFn(e){
        var _this = this;
        var formId = e.detail.formId;
        if (!this.data.reason){
            wx.showToast({ title: '请选择取消原因', icon: 'none', duration: 2000 });
            return;
        }
        var formData = {
            id:this.data.orderId,
            reason: this.data.reason
        }
        app.getFormIdFn(formId, () => { //获取formid
            app.requestFn({
                url: `/serviceOrder/cancel/${this.data.orderId}`,
                method: 'POST',
                header: 'application/x-www-form-urlencoded',
                data: formData,
                success: (res) => {
                    app.globalData.serveOrderReach = true;
                    wx.showToast({ title: '已取消', icon: 'success', duration: 2000 });
                    setTimeout(()=>{
                        wx.navigateBack()
                    },2000)
                }
            });
        })
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
    }
})