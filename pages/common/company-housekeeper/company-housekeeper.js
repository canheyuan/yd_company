const app = getApp();   //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数
const chatIm = require('../../../utils/chatIm.js');
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        listInfo: {},  //列表

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {
        this.verifyTime();
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'companyHousekeeper', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });
        this.getListInfo(true);
    },
  
    //获取列表
    getListInfo(isReach) {
        var _this = this;
        listFn.listPage({
            url: `/enterpriseManager`,
            isReach: isReach,
            page: _this,
            listDataName: 'listInfo',
            getListDataFn: (listdata) => {
                return {    //返回列表数据和总数
                    list: listdata.data,
                    total: listdata.total
                }
            },
            success: () => {  //setData完后执行的函数
                console.log("企业管家：", _this.data.listInfo);
            }
        });
    },
  
    //跳转到聊天窗口
    gotoChatFn(e) {
        //判断是否有登陆
        if (!app.globalData.isLogin) {
            this.setData({ isLoginPopHide: false });
            return;
        }
        var dataItem = e.currentTarget.dataset.item;
        var friendData = {
            id: dataItem.imid,
            faceUrl: dataItem.avatar,
            nick: dataItem.userName
        };
        app.chatData.toUser = friendData;
        //添加好友并跳转聊天界面
        app.addFriendFn(friendData.id, (res) => {
            wx.navigateTo({ url: `/pages/wechat/chat/chat` });
        })
    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj);
    },

    //拨打电话
    makePhoneCallFn(e) {
        var verifyTime = this.verifyTime();
        if (verifyTime){
            var tel = e.currentTarget.dataset.tel;
            wx.makePhoneCall({ phoneNumber: tel });
        }else{
            wx.showToast({ title: '请在工作时间9：00 ~ 17:00进行联系', icon: 'none', duration: 3000})
        }
    },

    //验证时间段
    verifyTime(){
        var b = false;
        var newDate = new Date();
        var weekNow = newDate.getDay();    //当前星期几：0-6
        var hour = newDate.getHours();
        if (weekNow == 0 || weekNow == 6 || hour <= 9 || hour >= 17){
            b = false;
        }else{
            b = true;
        } 
        return b;
    }
});