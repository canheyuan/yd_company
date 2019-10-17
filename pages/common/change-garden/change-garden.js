

const app = getApp();  //获取应用实例
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        loginInfo: null,
        listInfo: [],

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'gardenChange', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });

        this.setData({ loginInfo: app.globalData.loginInfo  });
        this.getListInfo(); //获取用户列表

    },

    //获取园区列表
    getListInfo() {
        var _this = this;
        app.requestFn({
            url: `/parkInfo/list`,
            data: {},
            success: (res) => {
                console.log("园区列表：", res);
                var list = res.data.data;
                var loginInfo = _this.data.loginInfo;
                loginInfo.curParkName = loginInfo.curParkName ? loginInfo.curParkName : loginInfo.userInfo.parkInfo.parkName;
                loginInfo.curParkId = loginInfo.curParkId ? loginInfo.curParkId : loginInfo.userInfo.parkInfo.parkId
                list.forEach((item) => {
                    if (loginInfo.curParkId == item.parkId) {
                        loginInfo.parkAddress = item.address
                        item.currentPark = 'act'
                    }
                });
                //设置data数据
                this.setData({
                    loginInfo: loginInfo,
                    listInfo: list
                });
            }
        });
    },

    //选择园区
    chooseGardenFn(e) {
        var gardenId = e.currentTarget.dataset.id;
        var gardenName = e.currentTarget.dataset.name;
        var gardenAddress = e.currentTarget.dataset.address;
        app.requestFn({
            laodTitle: this.data.langData.changeTip,
            isCloseLoading: false,
            url: `/parkInfo/select`,
            header: 'application/x-www-form-urlencoded',
            data: {
                parkId: gardenId
            },
            method: 'POST',
            success: (res) => {
                //获取缓存，改变缓存里的信息，然后重新设置缓存
                var userInfoStorage = wx.getStorageSync('userInfo');
                userInfoStorage.curParkId = gardenId;
                userInfoStorage.curParkName = gardenName;
                userInfoStorage.parkAddress = gardenAddress;

                console.log("选择园区缓存：", gardenId, gardenName, gardenAddress, userInfoStorage);
                wx.setStorageSync('userInfo', userInfoStorage); //设置缓存用户信息
                app.globalData.loginInfo = userInfoStorage;  //获取用户信息

                //重置所有刷新状态
                app.resetAllReach();

                this.setData({ gardenName: gardenName });
                setTimeout(function () { wx.navigateBack(); }, 1000);
            }
        });

    }
})