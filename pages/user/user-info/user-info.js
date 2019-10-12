//获取应用实例
const app = getApp();
var webim = require('../../../utils/webim_wx.js');
var commonFn = require('../../../utils/common.js');
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        userInfo: null,  //用户信息
        userData: null,
        sexList: ['保密', '男', '女'],  //性别选择
        sexIndex: 0,
        outPop: false,
        appVersion: app.globalData.appVersion, //更新的版本号

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'userInfo', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
            this.setData({ sexList: res.sexList })
        });

        var loginInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : null;  //从缓存获取用户信息
        if (loginInfo) {
            this.setData({
                userInfo: loginInfo.userInfo,
                sexIndex: loginInfo.userInfo.sex
            });
        }

    },

    //页面显示时执行
    onShow(e) {
        if (app.globalData.userInfoReach) {
            app.globalData.userInfoReach = false;

            var loginInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : null;  //从缓存获取用户信息
            if (loginInfo) {
                this.setData({
                    userInfo: loginInfo.userInfo,
                    sexIndex: loginInfo.userInfo.sex
                });
            }
        }
    },

    //修改头像
    changeHeadImgFn(e) {
        var _this = this;
        //选择图片   
        app.chooseImg({
            sizeType: ['compressed'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths;
                //上传图片文件
                app.uploadFile({
                    imgUrl: tempFilePaths[0],
                    entityType: 'user',
                    success: (res) => {
                        var changeImg = res.filePath;
                        var changeImg2 = res.urlPath;
                        
                        app.requestFn({
                            loadTitle: _this.data.langData.editTip,
                            url: `/userInfo/update`,
                            header: 'application/x-www-form-urlencoded',
                            data: {
                                "headImgs": changeImg
                            },
                            method: 'POST',
                            success: (res) => {
                                console.log("修改头像成功：", res.data);
                                //获取缓存，改变缓存里的信息，然后重新设置缓存
                                var loginInfo = wx.getStorageSync('userInfo');
                                loginInfo.userInfo['headImgs'] = changeImg2;
                                wx.setStorageSync('userInfo', loginInfo); //设置缓存用户信息
                                app.globalData.loginInfo = loginInfo;  //获取用户信息
                                _this.setData({ ["userInfo.headImgs"]: changeImg2 });
                                wx.showToast({ title: _this.data.langData.editSuccessTip, icon: "success", duration: 2000 });
                                app.globalData.userIndexReach = true;
                                _this.setUserImg(changeImg2);
                            }
                        });  
                    },
                })

                //上传图片
                // wx.uploadFile({
                //     url: app.globalData.jkUrl + '/uploadImage', //仅为示例，非真实的接口地址
                //     filePath: tempFilePaths[0],
                //     name: 'file',
                //     header: {
                //         '5ipark-sid': app.globalData.sessionId
                //     },
                //     formData: {
                //         'entityId': '',
                //         'entityType': 'user',
                //         'appCode': ''
                //     },
                //     success: (res) => {
                //         var datas = JSON.parse(res.data);
                //         if (datas.code == 0) {
                            
                //         }

                //     }, fail(err) {
                //         console.log(err);
                //     }
                // })
            }
        })
    },

    //修改IM用户信息
    setUserImg(img) {
        var _this = this;
        var options = {
            'ProfileItem': [
                { "Tag": "Tag_Profile_IM_Image", "Value": img }
            ]
        };
        webim.setProfilePortrait(options, function () {
            app.chatData.fromUser.faceUrl = img;
        });
    },

    //修改性别
    sexChange(e) {
        var _this = this;
        app.requestFn({
            loadTitle: _this.data.langData.editTip,
            url: `/userInfo/update`,
            header: 'application/x-www-form-urlencoded',
            data: {
                "sex": e.detail.value
            },
            method: 'POST',
            success: (res) => {
                console.log("修改性别成功：", res.data);
                //获取缓存，改变缓存里的信息，然后重新设置缓存
                var loginInfo = wx.getStorageSync('userInfo');
                loginInfo.userInfo['sex'] = e.detail.value;
                wx.setStorageSync('userInfo', loginInfo); //设置缓存用户信息
                app.globalData.loginInfo = loginInfo;  //获取用户信息
                this.setData({ sexIndex: e.detail.value });
                wx.showToast({ title: _this.data.langData.editSuccessTip, icon: "success", duration: 2000 });
                app.globalData.userIndexReach = true;
            }
        });
    },

    //打开或关闭 退出提示弹窗
    outPopFn() {
        this.setData({ outPop: !this.data.outPop })
    },

    //退出登录
    outLoginFn(e) {
        app.requestFn({
            isLoading: false,
            //loadTitle: this.data.langData.outTip,
            url: `/logout`,
            success: (res) => {
                console.log("退出登录成功：", res.data);
                wx.removeStorageSync('userInfo');
                //wx.clearStorageSync();  //清除缓存
                app.globalData.isLogin = false;
                app.globalData.loginInfo = null,

                    //重置所有刷新状态
                    app.resetAllReach();

                webim.logout();
                wx.removeStorageSync('backUrl'); //清除之前缓存
                wx.redirectTo({ url: '/pages/common/login/login' })
            }
        });
    },

    //跳转到修改信息页面
    gotoChange(e) {
        var c_type = e.currentTarget.dataset.type
        var c_value = e.currentTarget.dataset.value
        wx.navigateTo({
            url: '/pages/user/update-info/update-info?type=' + c_type + "&value=" + c_value
        })
    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        console.log('图片加载失败', e.currentTarget.dataset.obj);
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

})