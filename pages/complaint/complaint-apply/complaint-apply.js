const app = getApp();  //获取应用实例
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        userInfo: null,
        fileImgs: [],  //上传图片
        fileImgsNum: 3,  //可以上传的图片个数，最多三张

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
        console.log(removeIndex);
        imgArr.splice(removeIndex, 1);
        this.setData({
            fileImgsNum: 3 - imgArr.length,
            fileImgs: imgArr
        })
    },

    //提交表单
    submitFn(e) {
        var langData = this.data.langData;
        var formData = e.detail.value;
        var fileNum = 0;
        var fileImgs = this.data.fileImgs;
        if (formData.title == '') {
            wx.showToast({ title: langData.subjectTip, icon: 'none', duration: 2000 });
            return;
        }
        if (formData.content == '') {
            wx.showToast({ title: langData.feedbackTip, icon: 'none', duration: 2000 });
            return;
        }

        //上传图片文件
        fileImgs.forEach((item, i) => {
            wx.uploadFile({
                url: app.globalData.jkUrl + '/uploadImage',
                filePath: item,
                name: 'file',
                header: {
                    '5ipark-sid': app.globalData.sessionId
                },
                formData: {
                    'entityId': '',
                    'entityType': 'estateComplaint',
                    'appCode': ''
                },
                success(res) {
                    var datas = JSON.parse(res.data);
                    if (datas.code == 0) {
                        const changeImg = datas.data.filePath;
                        const changeImg2 = datas.data.urlPath;
                        fileImgs[i] = changeImg;
                        fileNum++;
                    }
                }, fail(err) {
                    console.log(err);
                }
            });
        });


        var timer = setInterval(() => {
            if (fileNum == fileImgs.length) {
                clearInterval(timer);
                if (fileImgs.length > 0) {
                    formData.images = this.data.fileImgs.reduce((prev, cur) => {
                        return prev + ',' + cur
                    })
                } else {
                    formData.images = '';
                }
                console.log('上传的参数：', formData);
                //提交formId
                app.requestFn({
                    loadTitle: langData.public.submit,
                    url: `/estateComplaint/add`,
                    //header: 'application/x-www-form-urlencoded',
                    data: formData,
                    method: 'POST',
                    success: (res) => {

                        wx.navigateTo({ url: '/pages/common/result/result?page=complaint' });

                    }
                });

            }
        }, 300);

    }

})