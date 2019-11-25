const app = getApp()    //获取应用实例
var WxParse = require('../../wxParse/wxParse.js'); //富文本
var commonFn = require('../../utils/common.js');
var regionFn = require('../../utils/region-data.js');
var chatIm = require('../../utils/chatIm.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        tagIndex: 0,
        tagList: null,

        expertId: null,
        expertData: null,
        isAttention: null,  //关注状态
        isLoginPopHide: true, //判断是否有登陆

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function (options) {
        //保存当前页面地址，登录页后回到这个页面
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' };
        wx.setStorageSync('backUrl', backUrl);

        this.setData({ expertId: options.id });
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'foundIndex', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.expertTitle[lang] });  //设置当前页面的title
            this.setData({ tagList: res.expertDetailTag });
        });
        this.getExpertData(options.id);
    },
    
    //选项卡切换
    tagChange(e) {
        var index = e.currentTarget.dataset.index
        this.setData({  tagIndex: index });
    },

    //获取专家信息
    getExpertData(expertId) {
        app.requestFn({
            isLoading:false,
            url: `/expert/detail/${expertId}`,
            success: (res) => {
                
                var detailData = res.data.data;
                //console.log("专家详情：", detailData)
                detailData.experience = commonFn.replaceTxt(detailData.experience);//富文本去掉<o:p>等标签
                detailData.intro = commonFn.replaceTxt(detailData.intro);
                detailData.achievement = commonFn.replaceTxt(detailData.achievement);

                WxParse.wxParse('experience', 'html', detailData.experience, this, 0); //富文本转换
                WxParse.wxParse('intro', 'html', detailData.intro, this, 0);
                WxParse.wxParse('achievement', 'html', detailData.achievement, this, 0);

                detailData.cityName = regionFn.regionData(detailData.cityId); //区域id转换区域名称

                this.setData({
                    expertData: detailData,
                    isAttention: detailData.isAttention
                });
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
            faceUrl: dataItem.headImg,
            nick: dataItem.expertName
        };
        app.chatData.toUser = friendData;
        //添加好友并跳转聊天界面
        app.addFriendFn(friendData.id, (res) => {
            wx.navigateTo({ url: `/pages/wechat/chat/chat` });
        })
    },

    //添加取消收藏活动
    collectFn() {
        var _this = this;
        var langData = this.data.langData
        var lang = this.data.lang
        //判断是否有登陆
        if (!app.globalData.isLogin) {
            this.setData({ isLoginPopHide: false });
            return;
        }
        //添加收藏
        if (_this.data.isAttention == 2) {
            app.requestFn({
                isLoading: false,
                url: `/expertAttention/add`,
                data: {
                    expertId: _this.data.expertId
                },
                method: 'POST',
                success: (res) => {
                    wx.showToast({ title: langData.collectText[lang], icon: 'success', duration: 2000 });
                    app.globalData.expertReach = true; //让发现页面的专家列表刷新
                    var attentionNum = _this.data.expertData.attentionNum +1
                    _this.setData({
                        ['expertData.attentionNum']: attentionNum,
                        isAttention: 1 
                    });
                }
            });
        } else if (_this.data.isAttention == 1) {
            app.requestFn({
                isLoading: false,
                url: `/expertAttention/remove/${_this.data.expertId}`,
                method: 'DELETE',
                success: (res) => {
                    wx.showToast({ title: langData.unCollectText[lang], icon: 'success', duration: 2000 });
                    app.globalData.expertReach = true; //让发现页面的专家列表刷新
                    var attentionNum = _this.data.expertData.attentionNum - 1
                    _this.setData({
                        ['expertData.attentionNum']: attentionNum,
                        isAttention: 2 
                    });
                }
            });
        }
    },

    //关闭登录提示弹窗
    closePopFn() {
        this.setData({ isLoginPopHide: true });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.getExpertData(this.data.expertId);
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //转发
    onShareAppMessage: function () {

    }
})