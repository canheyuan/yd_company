const app = getApp();    //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const formTip = require('../../../utils/validateForm.js');   //验证

var countGetCodeTimer = null;
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        getCode: {
            phone: '',          //手机号
            code: '',           //验证码   
            verificationId: '', //验证码id
            timer: null,        //倒计时定时器
            text: '',           //获取按钮文本
            sending: false,     //是否已发送
            show:false      //是否显示验证码那栏
        },
        getWxPhoneDetail:null,  //微信授权获取手机号信息
        wxBtnShow:true, //微信授权按钮是否显示
        phoneFocus:false,   //手机是否获得焦点
        company:{
            list:[],
            name:'',
            id:'',
            popIsShow:false,
            showNum:0
        },
        garden:{
            list: [],
            name: '',
            id: '',
            popIsShow: false
        },
        searchPl:'',
        auditTipPop: true,  //审核提示弹窗
        goUrl: '',  //跳转的链接

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {

        //聊天信息用的
        app.chatData.pageThis = this;
        app.chatData.chatPage = 'register';

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'formPage', (res) => {
            wx.setNavigationBarTitle({ title: res.registerTitle });  //设置当前页面的title
            this.setData({
                searchPl:res.searchKey,
                ['getCode.text']: res.public.getCodeBtn
            })
        });

        app.wxLogin();
        this.getGardenList();     //园区列表

        var goUrl = wx.getStorageSync('backUrl') ? wx.getStorageSync('backUrl') : null;
        this.setData({ goUrl: goUrl });
    },

   

    reachFn(){

    },

    //弹出园区弹窗
    gardenPopShow() {
        this.setData({ ['garden.popIsShow']: !this.data.garden.popIsShow });
    },

    //获取园区列表
    getGardenList() {
        var _this = this;
        app.requestFn({
            url: `/parkInfo/list`,
            isSessionId: false,
            success: (res) => {
                var list = res.data.data;
                _this.setData({ ['garden.list']: list });
            }
        });
    },

    //弹出企业弹窗
    companyPopShow() {
        var isTip = formTip([   //验证
            { name: 'park', verifyText: this.data.garden.id },
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序
        this.setData({ ['company.popIsShow']: !this.data.company.popIsShow });
    },

    //获取企业列表
    getCompanyList() {
        var _this = this;
        app.requestFn({
            url: `/enterpriseInfo/list`,
            isSessionId: false,
            data: {
                parkId: _this.data.garden.id
            },
            success: (res) => {
                var list = res.data.data;
                list.forEach(item=>{
                    item.isShow = false;
                })
                this.setData({ ['company.list']: list });
            }
        });
    },

    //文本框获得焦点
    searchFocusFn(e){
        var langData = this.data.langData;
        if (e.detail.value == '') {
            this.setData({ searchPl: '' });
        }
    },

    //文本框失去焦点
    searchBlurFn(e){
        var langData = this.data.langData;
        if (e.detail.value == '') {
            this.setData({ searchPl: langData.searchKey })
        }
    },

    //搜索企业
    searchCompanyFn(e) {
        var searchValue = e.detail.value;
        var companyList = this.data.company.list;
        var companyShowNum = 0;
        companyList.forEach(item => {
            var itemIsShow = !(item.entName.indexOf(searchValue) == -1) && searchValue;
            item.isShow = itemIsShow;
            if (itemIsShow) { companyShowNum++; }
            
        });
        this.setData({ 
            ['company.list']: companyList,
            ['company.showNum']: companyShowNum
        });
    },

    //获取微信手机号
    getPhoneNumber(e) {
        var detailVal = e.detail;
        if (detailVal.encryptedData) {   //判断是否有获取到信息
            console.log('允许获取手机号:', detailVal);

            app.requestFn({
                isSessionId: false,
                url: '/getWxPhone',
                header: 'application/x-www-form-urlencoded',
                method: 'POST',
                data: {
                    jsCode: app.globalData.loginCode,
                    encryptedData: detailVal.encryptedData,
                    ivStr: detailVal.iv
                },
                success: (res) => {
                    var phoneDetail = res.data.data;
                    console.log('手机号：', phoneDetail)
                    this.setData({
                        ['getCode.phone']: phoneDetail.phone,
                        ['getCode.code']: phoneDetail.code,
                        ['getCode.verificationId']: phoneDetail.id,
                        getWxPhoneDetail: phoneDetail,
                        wxBtnShow: false,
                    })
                    console.log('手机号2：', this.data.getCode)
                }
            })
        } else {
            this.setData({
                ['getCode.show']: true,
                phoneFocus: true,
                wxBtnShow: false
            })
            console.log('拒绝获取手机号:', detailVal);
        }
    },

    //改变手机号码时
    changePhoneFn(e) {
        this.setData({ ['getCode.phone']: e.detail.value })
    },

    //手机号失去焦点时
    blurPhoneFn(e){
        var phone = e.detail.value;
        var getWxPhoneDetail = this.data.getWxPhoneDetail; 
        var getCodeDetail = this.data.getCode;
        if (getWxPhoneDetail && phone != getWxPhoneDetail.phone){
            getCodeDetail['show'] = true;
            getCodeDetail['code'] = '';
            getCodeDetail['verificationId'] = ''
            this.setData({ getCode: getCodeDetail });
        } else if (getWxPhoneDetail && getWxPhoneDetail.phone == phone){
            getCodeDetail['show'] = false;
            getCodeDetail['code'] = getWxPhoneDetail.code;
            getCodeDetail['verificationId'] = getWxPhoneDetail.id;
            this.setData({ getCode: getCodeDetail });
        }
    },

    //获取手机code
    changeCodeFn(e) {
        this.setData({ ['getCode.code']: e.detail.value })
    },

    //选择园区
    chooseGardenFn(e) {
        var gardenId = e.currentTarget.dataset.id;
        var gardenName = e.currentTarget.dataset.name;
        this.setData({
            ['garden.id']: gardenId,
            ['garden.name']: gardenName
        });
        this.gardenPopShow();   //关闭园区弹窗
        this.getCompanyList();  //加载企业列表
    },

    //选择企业
    chooseCompanyFn(e) {

        var companyId = e.currentTarget.dataset.id;
        var companyName = e.currentTarget.dataset.name;
        this.setData({
            ['company.id']: companyId,
            ['company.name']: companyName
        });
        this.companyPopShow();  //关闭企业弹窗
    },

    //验证码倒计时
    countGetCodeFn() {
        var _this = this, time = 60;
        countGetCodeTimer = setInterval(function () {
            if (time > 0) {
                _this.setData({
                    ['getCode.text']: `${_this.data.langData.public.getCodeBtn2 + time}S`,
                    ['getCode.sending']: true,
                });
            } else {
                clearInterval(countGetCodeTimer);
                _this.setData({
                    ['getCode.text']: _this.data.langData.public.getCodeBtn,
                    ['getCode.sending']: false,
                });
            }
            time--;
        }, 1000);
    },

    //获取验证码
    getCodeFn(e) {

        if (this.data.getCode.sending) { return; } //防止多次点击
        var _this = this, 
            phone = this.data.getCode.phone,
            langData = this.data.langData;

        //验证
        var isTip = formTip([
            { name: 'phone', verifyText: phone },
        ]);
        if (isTip){return;} //若有提示，就终止下面程序

        _this.countGetCodeFn(); //倒计时

        //获取验证码
        app.requestFn({
            loadTitle: langData.public.sendTip,
            url: `/sendRegisterCode`,
            header: 'application/x-www-form-urlencoded',
            data: {
                mobile: phone
            },
            method: 'POST',
            success: (res) => {
                wx.showToast({ title: langData.public.sendSuccessTip, icon: 'success', duration: 3000 });
                _this.setData({ ['getCode.verificationId']: res.data.data.id })
            },
            fail: () => {
                wx.showToast({ title: langData.public.getCodeError, icon: 'none', duration: 3000 });
                clearInterval(countGetCodeTimer);
                _this.setData({ 
                    ['getCode.text']: langData.public.getCodeBtn,
                    ['getCode.sending']: false
                 });
            },
        });
    },

    //确认提交注册
    formSubmit(e) {
        var _this = this;
        var formData = e.detail.value;
        var formId = e.detail.formId;

        //验证
        var isTip = formTip([
            { name: 'park', verifyText: formData.parkId },
            { name: 'ent', verifyText: formData.entId },
            { name: 'name', verifyText: formData.name },
            { name: 'phone', verifyText: formData.mobile },
            { name: 'verifyCodeEmpty', verifyText: formData.verifyCode },
            { name: 'password', verifyText: formData.password },
            { name: 'passwordAgain', verifyText: formData.password2 },
            { name: 'passwordContrast', verifyText: formData.password, verifyText2: formData.password2 }
        ]);
        if (isTip) { return; } //若有提示，就终止下面程序

        var openId = app.globalData.openId ? app.globalData.openId : '';   //清除之前缓存
        formData['openId'] = openId;
        
        app.getFormIdFn(formId, () => {
            //提交注册数据
            app.requestFn({
                loadTitle: _this.data.langData.public.submit,
                url: `/register`,
                header: 'application/x-www-form-urlencoded',
                data: formData,
                method: 'POST',
                success: (res) => {

                    var loginInfo = res.data.data;
                    if (app.globalData.apiMsgSwitch) { console.log('注册成功返回数据:', loginInfo); }
                    wx.removeStorageSync('userInfo'); //清除之前缓存
                    app.globalData.sessionId = loginInfo.sessionId; //存储登录后的sessionId,记录登录状态

                    //注册完后重新获取wxlogin
                    app.getWxLoginInfo(() => {
                        app.resetAllReach();    //重置所有刷新状态
                        app.globalData.isLogin = true;  //登录状态
                        app.getImUserInfo();
                        wx.redirectTo({
                            url: '/pages/common/result/result?page=reg'
                        })
                        //_this.setData({ auditTipPop: false }); //注册成功弹窗
                    });

                },
                successOther: (res) => {   //提交不成功需要重新获取验证码
                    this.setData({
                        ['getCode.show']: true,
                        ['getCode.code']: '',
                        ['getCode.verificationId']: '',
                        getWxPhoneDetail: null
                    })
                },
                fail: (res) => {   //提交不成功需要重新获取验证码
                    this.setData({
                        ['getCode.show']: true,
                        ['getCode.code']: '',
                        ['getCode.verificationId']: '',
                        getWxPhoneDetail: null
                    })
                }
            });
        })
    }
})


