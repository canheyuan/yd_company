const app = getApp();
var commonFn = require('../../utils/common.js');
var WxParse = require('../../wxParse/wxParse.js');
var chatIm = require('../../utils/chatIm.js');


Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        policyData: null,
        policyId: "",
        isLoginPopHide: true, //判断是否有登陆
        isCollected: null, //是否已收藏

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function (options) {
        //保存当前页面地址，登录页后回到这个页面
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' };
        wx.setStorageSync('backUrl', backUrl);

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'policyDetail');

        this.setData({ policyId: options.id });
        this.getpolicyData(options.id); 
    },

    //获取政策详情
    getpolicyData(policyId) {
        var _this = this;
        app.requestFn({
            url: `/policy/detail/${policyId}`,
            success: (res) => {
                var data = res.data.data;

                data.description = commonFn.replaceTxt(data.description); //富文本去掉<o:p>等标签

                WxParse.wxParse('policy', 'html', data.description, _this, 0);
                data.beginTime = commonFn.getDate(data.beginTime).substr(0, 10);
                data.endTime = commonFn.getDate(data.endTime).substr(0, 10);
                data.probability = parseInt(data.probability);
                // if (data.highestReward > 10000) {
                //   data.highestReward = parseInt(data.highestReward / 10000) + "万"
                // }
                wx.setStorageSync('policyData', data);
                _this.setData({
                    policyData: data,
                    isCollected: data.isCollected
                });
                wx.setNavigationBarTitle({ title: data.policyTitle }); //设置title
                console.log("政策详情数据：", _this.data.policyData);
            }
        });
    },

    //咨询客服
    kefuFn(e) {
        var _this = this;
        if (!app.globalData.isLogin) {
            this.setData({ isLoginPopHide: false });
        } else {
            app.requestFn({
                url: `/policy/consult/${_this.data.policyId}`,
                success: (res) => {
                    var imId = res.data.data.imid;  //聊天id
                    //console.log('政策客服咨询：', res.data);
                    _this.gotoChatFn(imId);
                }
            });
        }
    },

    //关闭登录提示弹窗
    closePopFn() {
        this.setData({ isLoginPopHide: true });
    },

    //跳转到聊天窗口
    gotoChatFn(imId) {
        var langData = this.data.langData
        var lang = this.data.lang
        //判断是否有登陆
        if (!app.globalData.isLogin) {
            this.setData({ isLoginPopHide: false });
            return;
        }
        var friendData = {
            id: imId,
            faceUrl: '',
            nick: langData.public.service[lang]
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
        var langData = this.data.langData
        var lang = this.data.lang
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
            friendData['default_msg'] = langData.public.consultationTip[lang] + this.data.policyData.policyTitle;
        };
        if (!b) {
            chatMessage.push({
                user: loginName,
                article_id: article_id,
                creattime: new Date().getTime()
            });
        };
        wx.setStorageSync('chatMessage', chatMessage);
        return friendData;
    },


    //添加取消收藏活动
    collectFn(e) {
        var langData = this.data.langData
        var lang = this.data.lang
        //判断是否有登陆
        if (!app.globalData.isLogin) {
            this.setData({ isLoginPopHide: false });
            return;
        }
        //添加收藏活动
        var _this = this;
        if (_this.data.isCollected == 2) {
            app.requestFn({
                isLoading: false,
                url: `/policyCollection/add`,
                data: {
                    policyId: _this.data.policyId
                },
                method: 'POST',
                success: (res) => {
                    wx.showToast({ title: langData.public.collectTip[lang], icon: 'success', duration: 2000 });
                    _this.setData({ isCollected: 1 });
                }
            });

        } else if (_this.data.isCollected == 1) {
            //取消收藏活动
            app.requestFn({
                isLoading: false,
                url: `/policyCollection/remove/${_this.data.policyId}`,
                method: 'DELETE',
                success: (res) => {
                    wx.showToast({ title: langData.public.callOffCollectTip[lang], icon: 'none', duration: 2000 });
                    _this.setData({ isCollected: 2 });
                }
            });

        }

    },

    //复制原文链接
    copyUrlFn(e) {
        var url = e.currentTarget.dataset.url;
        wx.setClipboardData({
            data: url,
            success:(res)=> {
                wx.showToast({ title: this.data.langData.copyTip[lang], icon: 'success', duration: 2000 });
            }
        });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.getpolicyData(this.data.policyId);
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //转发
    onShareAppMessage: function () {

    }
})