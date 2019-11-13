const app = getApp();  //获取应用实例
const formTip = require('../../utils/validateForm.js');   //验证

Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        userInfo: null,
        fileImgs: [],  //上传图片
        fileImgsNum: 3,  //可以上传的图片个数，最多三张
        formSubmitStatus: false, //提交状态，控制不重复提交（true：提交中，false：未提交）

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        this.setData({
            userInfo: app.globalData.loginInfo.userInfo
        })
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'complaint', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });

    },

    //上传图片
    fileImageFn() {
        var _this = this;
        app.chooseImg({
            count: _this.data.fileImgsNum, // 默认9
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

    //提交表单
    submitFn(e) {
        var _this = this;
        var langData = this.data.langData;
        var formData = e.detail.value;
        var formId = e.detail.formId;

        var fileSuccessNum = 0;
        var fileErrorNum = 0;
        var fileViolationNum = 0;
        var fileImgs = this.data.fileImgs;

        //验证
        var isTip = formTip([
            { name: 'empty', verifyText: formData.title, tipText: langData.subjectTip },
            { name: 'empty', verifyText: formData.content, tipText: langData.feedbackTip }
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序

        if (this.data.formSubmitStatus) {    //控制不重复提交
            return;
        } else {
            _this.setData({ formSubmitStatus: true })
        }
        //上传图片文件
        fileImgs.forEach((item, i) => {
            app.uploadFile({
                imgUrl: item,
                entityType: 'estateComplaint',
                success: (res) => {
                    fileImgs[i] = res.filePath;
                    fileSuccessNum++;
                },
                violation: (imgurl) => {   //违规回调函数
                    fileViolationNum++;
                },
                fail: () => {
                    fileErrorNum++;
                }
            })
        });

        var timer = setInterval(() => {

            if ((fileErrorNum + fileViolationNum + fileSuccessNum) == fileImgs.length) {
                clearInterval(timer);
                if (fileViolationNum > 0) {  //有违规图片，终止
                    return;
                }
                if (fileImgs.length > 0) {
                    formData.images = this.data.fileImgs.reduce((prev, cur) => {
                        return prev + ',' + cur
                    })
                } else {
                    formData.images = '';
                }
                //console.log('上传的参数：', datas);
                //提交formId
                app.getFormIdFn(formId, () => {
                    app.requestFn({
                        loadTitle: langData.public.submit,
                        url: `/estateComplaint/add`,
                        data: formData,
                        //header: 'application/x-www-form-urlencoded',
                        method: 'POST',
                        success: (res) => {
                            wx.redirectTo({ url: '/pages/common/result/result?page=complaint' })
                        },
                        complete() {
                            _this.setData({ formSubmitStatus: false })
                        }
                    });
                })
            }
        }, 300);

    }

})