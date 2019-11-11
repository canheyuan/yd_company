const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var commonFn = require('../../utils/common.js');
var chatIm = require('../../utils/chatIm.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        servicesIntro: null,
        serviceId: null,  //服务Id
        isLoginPopHide: true,  //

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {
        //保存当前页面地址，登录页后回到这个页面
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' }
        wx.setStorageSync('backUrl', backUrl)

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'services', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        })

        this.setData({ serviceId: options.id })
        this.getServicesIntro(options.id)
    },

    //获取详情
    getServicesIntro(id) {
        var _this = this;
        app.requestFn({
            url: `/enterpriseService/detail/${id}`,
            success: (res) => {
                var servicesIntro = res.data.data;
                WxParse.wxParse('content', 'html', servicesIntro.content, _this, 0);
                this.setData({ servicesIntro: servicesIntro });
                wx.setNavigationBarTitle({ title: servicesIntro.title });
            }
        })
    },

    //转发
    onShareAppMessage: function () {
        
    },

    //客服
    kefuFn(e) {
        var _this = this;
        if (!app.globalData.isLogin) {
            this.setData({ isLoginPopHide: false });
        } else {
            app.requestFn({
                url: `/enterpriseService/consult/${_this.data.serviceId}`,
                success: (res) => {
                    console.log('服务咨询接口数据：', res.data);
                    var imId = res.data.data.imid;  //聊天id
                    var avatar = res.data.data.avatar;  //头像
                    _this.gotoChatFn(imId, avatar);
                }
            });
        }
    },

    //关闭登录提示弹窗
    closePopFn() {
        this.setData({ isLoginPopHide: true });
    },

    //跳转到聊天窗口
    gotoChatFn(imId, avatar) {
        //判断是否有登陆
        if (!app.globalData.isLogin) {
            this.setData({ isLoginPopHide: false });
            return;
        }
        var friendData = {
            id: imId,
            faceUrl: avatar,
            nick: this.data.langData.public.service
        };
        friendData = this.setStorage(friendData);
        app.chatData.toUser = friendData;
        //添加好友并跳转聊天界面
        app.addFriendFn(friendData.id, (res) => {
            wx.navigateTo({ url: `/pages/wechat/chat/chat` });
        })
    },

    //判断是否发送消息，且设置缓存
    setStorage(friendData) {
        var chatMessage = wx.getStorageSync('chatMessage') ? wx.getStorageSync('chatMessage') : [];
        var loginName = app.globalData.loginInfo.loginName;
        var article_id = this.data.serviceId;
        var nowTime = new Date().getTime();
        var chat_time = null;
        var b = false;  //判断缓存里之前是否有记录
        //查找是否已有缓存数据，有的话，换个时间没有再添加
        chatMessage.forEach(item => {
            if (item.user == loginName && item.article_id == article_id) {
                b = true;
                chat_time = item.creattime;
                item.creattime = nowTime;
            }
        });
        if (!chat_time || (chat_time + 24 * 60 * 60 * 1000) < nowTime) {
            friendData['default_msg'] = this.data.langData.public.consultationTip + this.data.servicesIntro.title;
        }
        if (!b) {
            chatMessage.push({
                user: loginName,
                article_id: article_id,
                creattime: new Date().getTime()
            })
        }
        wx.setStorageSync('chatMessage', chatMessage);
        return friendData;
    },

    //获取好友列表
    getAllFriend(callback) {
        var that = this;
        chatIm.getAllFriend(app, function (res) {
            var list = res.InfoItem ? res.InfoItem : [];
            list.forEach(item => {
                item.To_Account = item.Info_Account;
                item.C2cNick = item.SnsProfileItem ? item.SnsProfileItem[0].Value : '';
            });
            callback && callback(list);
        });
    },

})