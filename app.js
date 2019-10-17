const mtjwxsdk = require('./utils/mtj-wx-sdk.js');  //百度统计

//app.js
var appConfig = require('config.js');   //不同小程序的配置信息
let langJson = require('lang.js');   //加载语言文件包
let webim = require('utils/webim_wx.js');   //腾讯云IM
let chatIm = require('utils/chatIm.js');    //封装腾讯云接口

App({
    globalData: {
        appVersion: '1.3.2',       //上传的版本号
        appVersionDate: '20191016', //版本更新的日期

        langType: '',     //当前小程序的语言版本
        langData: null,

        domainUrlDev: 'http://192.168.0.244/yuanding',        //接口测试机
        domainUrl: 'https://www.5iparks.com/static/yuanding', //图片正式机
        jkDevUrl: 'http://192.168.0.244:8080/api',  //图片开发板
        jkUrl: 'https://www.5iparks.com/api',       //接口正式版

        //判断页面是否刷新参数（刷新：true，不刷新：false）
        foundTag: 0,        //进入发现页，0新鲜事，1政策
        indexReach: true,    //首页
        foundReach: true,    //发现
        expertReach: true,    //发现页专家
        serveReach: true,    //服务首页
        userIndexReach: true,    //我的页面
        userInfoReach: false,    //修改信息页面
        couponListReach: false,    //我的卡包券
        myRepairReach: false,    //我的报修列表

        loginCode: '',        //微信登录获取code
        isLogin: false,       //登录状态
        isWxLogin: false,     //控制是否正在加载获取用户信息接口
        isChatLogin: true,    //控制是否调用聊天登录,true:开启，false:关闭

        sessionId: '',        //登录后会生成的一个sid
        loginInfo: null,      //缓存用户登录信息
        openId:'',
        groupId: '',          //集团小组id（后期基本很少用到）
        apiMsgSwitch: false,  //控制接口提示信息开关,true:开，false:关

        //（招管家）跳转小程序配置信息
        app_zgj: {
            appId: 'wx16b70a801be2f7d1',
            parame: {
                source: 'XZYD', //固定填写‘XZYD’，代表用户来自“小招园丁”平台
                mobileNo: '', //当前用户在小招园丁登记的手机号码（通过该手机号来匹配招管家用户）
                mcdzCode: ''  //当前咨询商品的商品编码，如果未填写则跳转至招管家首页
            }
        },

        //(小招企服)跳转小程序配置信息（有了招管家后，现在没用了，这个）
        app_zs: {
            appId: 'wx53305a846213b151',
            parame: {
                channel: 'cmbchina',
                extInfo: { park: 'yuanding' }
            }
        },

    },

    onLaunch: function (opt) {
        
        //在globalData加入功能开关
        this.globalData.appApi = appConfig.appApi
        this.globalData.moduleSwitch = appConfig.moduleSwitch;

        //获取语言
        this.globalData.langData = langJson;
        if (this.globalData.moduleSwitch.lang){
            this.globalData.langType = wx.getStorageSync('langtype') ? wx.getStorageSync('langtype') : 'zh';
            if (this.globalData.langType == 'en') {
                wx.hideTabBar();
            }
        }else{
            this.globalData.langType = 'zh'
        }

        //判断是否是开发版本，是的话调用开发版的前缀
        if (opt.query.config == 'dev') {
            this.globalData.jkUrl = this.globalData.jkDevUrl;
            this.globalData.domainUrl = this.globalData.domainUrlDev;
        }
        
        //用户小组，后续通过特地的二维码带上这个参
        this.globalData.groupId = opt.query.gid || '';

        //获取登录信息
        this.getWxLoginInfo();
    },

    //当前页加载语言文件包(页面this，页面对应json的字段，)
    loadLangFn(pageThis, page, callback) {
        //设置语言,判断是否切换语言
        var langType = this.globalData.langType;
        if (langType != pageThis.data.langType) {
            var newLangData = this.globalData.langData[langType][page];
            var langPublicData = this.globalData.langData[langType].public;
            newLangData.public = langPublicData;
            var setDatas = {
                langType: langType,
                langData: newLangData
            }
            pageThis.setData(setDatas);
            callback && callback(newLangData);
        }
    },


    //统一的调用接口函数，接口返回错误码code（206:未认证企业；207：sessionId失效；0：正常）
    requestFn(option) {
        var _this = this;
        let opt = option ? option : null;
        let opt_default = {
            isLoading       : true,  //是否加载loading
            isCloseLoading  : true,  //是否关闭Loading
            loadTitle       : '数据加载中',
            isLoginTip      : false,    //是否弹出未登录提示
            isSessionId     : true,  //是否传sessionId
            url             : '', //前缀不用写
            header          : 'application/json', //另一种（application/x-www-form-urlencoded）
            method          : 'GET',    //接口类型
            data            : {},   //接口接受的参数
            dataType        : 'json',   //数据返回类型
            success         : null,  //成功回调函数
            successOther    : null,  //成功回调，code不为0时调用
            fail            : null,     //失败回调函数
            complete        : null   //调用接口完回调函数
        };
        opt = opt ? Object.assign(opt_default, opt) : opt_default;
        if (opt.isLoading) { wx.showLoading({ title: opt.loadTitle, mask: true }); }
        wx.request({
            url: _this.globalData.jkUrl + opt.url,
            method: opt.method,
            header: {
                "Content-Type"  : opt.header,
                "5ipark-gid"    : _this.globalData.groupId || '',
                "5ipark-sid"    : opt.isSessionId ? _this.globalData.sessionId : '',
                "5ipark-channel": _this.globalData.appApi.channel,   //之前是为了区分小招园叮（cmb），现在不知还有没用
                "5ipark-aid"    : _this.globalData.appApi.aid,
                "Cache-Control" : "max-age=3600", 
            },
            data    : opt.data,
            dataType: opt.dataType,
            success : (res) => {
                if (opt.isCloseLoading) { wx.hideLoading(); };      //判断当前接口加载完是否关闭loading,默认：否
                var apiData = res.data;
                if (apiData.code == 0) {

                    if (opt.success) { opt.success(res, opt.page) }; //成功回调函数

                } else if (apiData.code == 207) {   //207表示：sessionID失效

                    if (opt.isLoginTip) {   //判断sid过期是否弹出提示
                        wx.showToast({ title: '登录已超时，请重新登录再进行操作！', icon: 'none', duration: 3000 });
                    }

                    if (!_this.globalData.isWxLogin) {  //
                        _this.globalData.isWxLogin = true;  //控制接口sessionID失效时不会重复调用wxLogin
                        _this.globalData.isLogin = false;
                        _this.globalData.sessionId = '';
                        wx.removeStorageSync('userInfo'); //清除之前缓存
                        //重新调用微信授权，为了不让页面接口调用不到数据
                        //(常见情况就是用户退出登录后没有重新登录，再次访问页面时)
                        _this.getWxLoginInfo(()=> {
                            if (_this.chatData.pageThis){
                                _this.chatData.pageThis.reachFn();
                            }
                        });
                    }
                    
                } else {
                    this.globalData.indexReach = true;
                    wx.showToast({ title: res.data.msg, icon: 'none', duration: 3000 });
                }
                opt.successOther && opt.successOther(res);

            },
            fail(res) {
                wx.hideLoading();
                wx.showToast({ title: '数据加载失败', icon: 'none', duration: 3000 });
                if (opt.failFn) { opt.failFn(res) }; //失败回调函数
            },
            complete(res) {
                if (opt.complete) { opt.complete(res) }; //失败回调函数
            }
        });
    },

    //重置所有刷新状态
    resetAllReach(){    
        this.globalData.indexReach = true;
        this.globalData.foundReach = true;
        this.globalData.expertReach = true;
        this.globalData.serveReach = true;
        this.globalData.userIndexReach = true;
        // this.globalData.userInfoReach = true;
        // this.globalData.couponListReach = false;
        // this.globalData.myRepairReach = false;
    },

    //选择图片
    chooseImg(option){
        var _this = this;
        let opt = option ? option : null;
        let opt_default = {
            count: 1,   //个数
            sizeType: ['original', 'compressed'],   //所选图片尺寸（原图、压缩）
            sourceType: ['album', 'camera'],    //选择图片的来源（从相册选图、使用相机）
            success: null,  //成功回调函数
            fail: null,     //失败回调函数
            complete: null   //调用接口完回调函数
        };
        opt = opt ? Object.assign(opt_default, opt) : opt_default;
        wx.chooseImage({
            count: opt.count,
            sizeType: opt.sizeType,
            sourceType: opt.sourceType,
            success:(res)=>{
                console.log('选择图片：',res);
                var imgList = res.tempFilePaths
                opt.success && opt.success(res);
            },
            fail:()=>{
                opt.fail && opt.fail();
            },
            complete:()=>{
                opt.complete && opt.complete();
            }
        })
    },

    //检测文字是否违规
    msgSecCheck(msg,callback){
        this.requestFn({
            url:`/ma/checkMessage?message=${msg}`,
            method:'POST',
            // data:{
            //     message : msg
            // },
            success:(res)=>{
                if (res.data.data){ //true是不违规，false违规
                    callback && callback(res.data.data);
                }else{
                    wx.showToast({ title: '您输入的文字存在敏感字眼，请重新输入！', icon: 'none', duration: 3000 });
                }
            }
        })
    },

    //上传文件图片接口
    uploadFile(option){
        var _this = this;
        let opt = option ? option : null;
        let opt_default = {
            imgUrl:'',  //上传的图片地址
            fileName:'file',
            entityType:'estaterepair',
            violation:null, //违规返回函数
            success: null,  //成功回调函数
            fail: null,     //失败回调函数
            complete: null   //调用接口完回调函数
        };
        opt = opt ? Object.assign(opt_default, opt) : opt_default;
        wx.uploadFile({
            url: this.globalData.jkUrl + '/uploadImage',
            filePath: opt.imgUrl,
            name: opt.fileName,
            header: {
                '5ipark-sid': this.globalData.sessionId
            },
            formData: {
                'entityId': '',
                'entityType': opt.entityType,
                'appCode': ''
            },
            success(res) {
                var datas = JSON.parse(res.data);
                console.log('通用上传图片返回字段：',datas);
                if (datas.code == 0) {
                    opt.success && opt.success(datas.data);
                } else if (datas.code == 802) {    //图片违规
                    wx.showToast({ title: '图片存在违规信息，请重新上传！', icon: 'none', duration: 3000 });
                    opt.violation && opt.violation(opt.imgUrl);
                }
            },
            fail(err) {
                wx.showToast({ title: '图片上传失败！', icon: 'none', duration: 3000 });
                opt.fail && opt.fail();
            },
            complete:()=>{
                opt.complete && opt.complete();
            }
        });
    },


    //进入后台模式
    onHide() {
        //切换后台后，防止进来拿不到数据
        this.globalData.indexReach = true;     //进入首页是否刷新
    },

    //获取用户登录信息
    getWxLoginInfo(callback) {
        var _this = this;

        //从缓存获取用户信息
        var loginInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : null;  
        
        //判断是否有登录缓存信息
        if (!loginInfo || !loginInfo.userInfo.loginName) {  
            if (loginInfo && loginInfo.sessionId) {  //即使没登录也有sessionId的，先记录
                _this.globalData.sessionId = loginInfo.sessionId 
            };   
            
            _this.wxLogin(()=> { //获取登录code
                wx.getSetting({     //获取微信授权信息
                    success: res => {
                        if (res.authSetting['scope.userInfo']) {    //判断是否已经授权  
                            _this.getUserInfo((userData)=> {  //获取用户基本信息
                                _this.afterGetUserInfo(userData, () => {
                                    callback && callback();
                                });
                            });
                        } else {
                            _this.afterGetUserInfo(false, () => {
                                callback && callback();
                            })
                        }
                    }
                });
            });

        } else {
            console.log("缓存获取登录用户数据：", loginInfo);
            _this.globalData.isLogin = (loginInfo && loginInfo.loginName) ? true : false; //登录状态
            _this.globalData.loginInfo = loginInfo;
            _this.globalData.sessionId = loginInfo.sessionId;
            _this.globalData.openId = loginInfo.otherLoginId
            //判断登录状态，登录才调用聊天接口
            if (_this.globalData.isLogin) { this.getImUserInfo();   }

        }
    },

    //获取loginCode
    wxLogin(callback) {
        wx.login({
            success: res => {
                this.globalData.loginCode = res.code;
                console.log('loginCode', res.code)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                callback && callback(res.code);
            }
        });
    },

    //获取用户信息
    getUserInfo(callback) {
        wx.getUserInfo({
            success: res => {
                // 可以将 res 发送给后台解码出 unionId
                callback && callback(res)
            }
        })
    },

    //微信登录后获取登录信息
    afterGetUserInfo(uData, callback) {
        var _this = this;
        var userData = null;
       
        if (!uData) {    //判断是否已授权，获取不同的参数
            userData = { code: _this.globalData.loginCode }
        } else {
            userData = {
                code         : _this.globalData.loginCode,
                rawData      : uData.rawData,
                encryptedData: uData.encryptedData,
                iv           : uData.iv,
                signature    : uData.signature
            };
        }
        _this.requestFn({
            url:'/wxlogin',
            method: 'post',
            header:'application/x-www-form-urlencoded',
            data: userData,
            success(res){
                var loginInfo = res.data.data;
                wx.setStorageSync('userInfo', loginInfo); //设置缓存用户信息
                _this.globalData.loginInfo = loginInfo;
                _this.globalData.sessionId = loginInfo.sessionId;
                _this.globalData.openId = loginInfo.otherLoginId
                _this.globalData.isWxLogin = false;
                if (loginInfo && loginInfo.loginName) {
                    _this.globalData.isLogin = true; //登录状态
                }
                console.log('wxLogin接口获取用户信息：', loginInfo);
                callback && callback(loginInfo); //回调函数
            },
            complete(res){
                if(res.data.code !=0){  //code非0才调用，因为为0的时候上面已经调用过一次了，防止调用两次
                    callback && callback(res); //回调函数
                }
            }
        })
    },

    //获取IM用户信息
    getImUserInfo() {
        var _this = this;
        this.requestFn({
            url: '/info4im',
            success: (res) => {
                if (this.globalData.apiMsgSwitch) { console.log("聊天接口：", res.data); }
                this.chatData.fromUser = res.data.data;
                if (this.globalData.isChatLogin) {
                    setTimeout(()=>{
                        _this.chatLogin()
                    },3000)
                   
                }
            }
        })
    },

    //聊天信息
    chatData: {
        chatPage: '',   //当前页面名称
        pageThis: null,  //当前页面的this
        chatLoginSuccess: false,
        Config: {
            sdkappid: appConfig.IM.sdkAppID,//
            accountType: appConfig.IM.accountType,
            accountMode: 0 //帐号模式，0-表示独立模式
        },
        fromUser: null,
        toUser: {
            id: '', nick: '',  faceUrl: ''
        },
    },

    //IM添加好友
    addFriendFn(imId, callback) {
        var _this = this;
        this.getAllFriend(function (res) {

            var isFriend = false;
            res.forEach(item => {   //循环查找是否有该好友
                if (imId == item.Info_Account) {
                    isFriend = true;
                }
            });

            if (!isFriend) {    //非好友，先添加
                _this.requestFn({
                    isLoading: false,
                    url: `/im/addFriend`,
                    data: { friendId: imId },
                    header: 'application/x-www-form-urlencoded',
                    method: 'POST',
                    success: (res) => {
                        console.log('添加好友成功！');
                        callback && callback(res);
                    }
                });
            } else {
                callback && callback(res);  //已经是好友
            }

        })

    },

    //获取IM好友列表
    getAllFriend(callback) {
        var _this = this;
        chatIm.getAllFriend(_this, function (res) {
            var list = res.InfoItem ? res.InfoItem : [];
            list.forEach(item => {
                item.To_Account = item.Info_Account;
                item.C2cNick = item.SnsProfileItem ? item.SnsProfileItem[0].Value : '';
            });
            callback && callback(list);
        });
    },

    //修改IM用户信息
    setUserImg(name, img) {
        var _this = this;
        var options = {
            'ProfileItem': [
                { "Tag": "Tag_Profile_IM_Nick", "Value": name },
                { "Tag": "Tag_Profile_IM_Image", "Value": img }
            ]
        };
        webim.setProfilePortrait(options, function () {
            _this.chatData.fromUser.nick = name;
            _this.chatData.fromUser.faceUrl = img;
        });
    },

    //聊天登录
    chatLogin(callback) {
        var _this = this;
        var loginInfo = {
            'sdkAppID': _this.chatData.Config.sdkappid,   //用户所属应用id,必填
            'appIDAt3rd': _this.chatData.Config.sdkappid, //用户所属应用id，必填
            'accountType': _this.chatData.Config.accountType, //用户所属应用帐号类型，必填
            'identifier': _this.chatData.fromUser.id, //当前用户ID,必须是否字符串类型，选填
            'identifierNick': _this.chatData.fromUser.nick, //当前用户昵称，选填
            'userSig': _this.chatData.fromUser.sig, //当前用户身份凭证，必须是字符串类型，选填
        }

        //事件回调对象 监听事件
        var listeners = {
            "onConnNotify": _this.onConnNotify, //监听连接状态回调变化事件,必填
            "onMsgNotify": _this.onMsgNotify//监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
        };

        var options = {};

        //sdk登录(独立模式)
        webim.login(loginInfo, listeners, options, function (resp) {

            console.log("IM登录成功");
            _this.chatData.chatLoginSuccess = true;
            _this.setUserImg(_this.chatData.fromUser.nick, _this.chatData.fromUser.faceUrl);
            if (callback) { callback() }
        }, function (err) {
            console.log("登录失败", err.ErrorInfo)
        });
    },

    //1v1单聊的话，一般只需要 'onConnNotify' 和 'onMsgNotify'就行了。
    //监听连接状态回调变化事件
    onConnNotify(resp) {
        var info;
        switch (resp.ErrorCode) {//链接状态码
            case webim.CONNECTION_STATUS.ON:
                webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
                break;
            case webim.CONNECTION_STATUS.OFF:
                info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;
                webim.Log.warn(info);
                break;
            case webim.CONNECTION_STATUS.RECONNECT:
                info = '连接状态恢复正常: ' + resp.ErrorInfo;
                webim.Log.warn(info);
                break;
            default:
                webim.Log.error('未知连接状态: =' + resp.ErrorInfo); //错误信息
                break;
        }
    },

    //监听新消息事件     注：其中参数 newMsgList 为 webim.Msg 数组，即 [webim.Msg]。
    //newMsgList 为新消息数组，结构为[Msg]
    onMsgNotify(newMsgList, callback) {
        console.log('监听新消息事件333', newMsgList);
        if (!newMsgList) { return };

        //做缓存记录未读消息
        var msgStorage = wx.getStorageSync('msgStorage') ? wx.getStorageSync('msgStorage') : [];
        newMsgList.forEach((item, i) => {
            var isMsg = false;  //当前账号是否有未读消息
            msgStorage.forEach(item2 => {
                if (item2.fromAccount == item.fromAccount) {
                    item2.fromAccount = item.fromAccount
                    item2.unread = item2.unread + 1; //未读消息数
                    isMsg = true;
                }
            });
            if (!isMsg) {
                var nesMsg = {};
                nesMsg.fromAccount = item.fromAccount
                nesMsg.unread = 1; //未读消息数
                msgStorage.push(nesMsg);
            }
        })
        wx.setStorageSync('msgStorage', msgStorage);
        callback && callback();

        if (this.chatData.chatPage == 'chat-detail') { //聊天会话页面

            var sess, newMsg;
            //获取所有聊天会话
            var selSess = null;
            var sessMap = webim.MsgStore.sessMap();
            var newMsg2 = null;
            for (var j in newMsgList) {//遍历新消息
                newMsg = newMsgList[j];
                if (newMsg.getSession().id() == this.chatData.toUser.id) {//为当前聊天对象的消息
                    selSess = newMsg.getSession();
                    newMsg2 = chatIm.addMsg(this, newMsg);  //在聊天窗体中新增一条消息
                }
            }

            var chatList = this.chatData.pageThis.data.chatItems.concat(newMsg2);
            chatList.forEach(item => {
                item.headUrl = item.isMy ? this.chatData.fromUser.faceUrl : this.chatData.toUser.faceUrl;
                item.headUrl = item.headUrl ? item.headUrl : (this.globalData.domainUrl + '/images/default/df_userhead.png');
            });
            console.log('chatList:', chatList);
            this.chatData.pageThis.setData({
                chatItems: chatList,
                scrollTopVal: chatList.length * 999
            });

            //消息已读上报，以及设置会话自动已读标记
            webim.setAutoRead(selSess, true, true);

            //阅读消息后清除未读消息缓存
            var msgStorage = wx.getStorageSync('msgStorage') ? wx.getStorageSync('msgStorage') : [];
            msgStorage = msgStorage.filter(item => {
                return item.fromAccount != this.chatData.toUser.id
            });
            wx.setStorageSync('msgStorage', msgStorage);

        } else if (this.chatData.chatPage == 'chat-list') {
            this.chatData.pageThis.initRecentContactList(); //获取会话列表        
        } else if (this.chatData.chatPage == 'index') {
            this.chatData.pageThis.getNotification(); //获取会话列表        
        }
    },

    //调用支付函数
    wxPayFn(payData, callback) {
        var _this = this;
        wx.requestPayment({
            'timeStamp': payData.timeStamp,
            'nonceStr': payData.nonceStr,
            'package': payData.package,
            'signType': 'MD5',
            'paySign': payData.paySign,
            'success': function (res) {
                console.log("支付成功", res);
                callback && callback(res);
            },
            'fail': function (res) {
                console.log("支付失败", res);
                callback && callback(res);
            }
        })
    },

    //获取formID
    getFormIdFn(formId,callback){
        var openId = this.globalData.openId;
        this.requestFn({
            isLoading:false,
            url: `/maFormId/add`,
            header: 'application/x-www-form-urlencoded',
            data: {
                openId: openId,
                formId: formId
            },
            method: 'POST',
            complete:()=>{
                callback && callback();
            }
        })
    },

    //预览图片（当前图片地址，图片地址列表）
    previewImgFn(currentImg, imgList) {
        wx.previewImage({
            current: currentImg,  // 当前显示图片的http链接
            urls: imgList         // 需要预览的图片http链接列表
        })
    },

})