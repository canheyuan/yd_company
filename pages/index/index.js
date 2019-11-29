const commonFn = require('../../utils/common.js'); //一些通用的函数
const app = getApp();   //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        moduleSwitch: null,     //功能开关按钮
        topParkName: '',
        isLoginPopHide: true,  //是否隐藏登录提示
        loginInfo: '', //登录用户信息
        backTopShow: false, //返回顶部是否显示


        indexSlide: [], //幻灯片数据
        indexSlideIndex:0,

        noticeData: null, //通知公告数据
        msgNum: 0,  //未读消息数

        backLogIsShow:false,    //待办模块是否显示
        backLogReach:0, //刷新待办字段

        houseList:[],   //招商一览列表
        policyList: [],  //申报政策
        hotActList: [],  //热门活动

        //菜单栏
        menuData: null, //菜单列表
        moreMenuShow: false,  //判断更多按钮是否加“up”class
        showMenuNum: 0,     //菜单按钮显示的个数
        menuHeight: "380rpx",
        
        zsAppData: null,  //跳转小招企服参数
        zgjAppData: null,   //跳转招管家参数
        orderIsShow:false,  //账单查询是否有权限显示

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //页面加载完之后执行
    onLoad: function (option) {
        console.log('首页')
    },

    //页面显示加载
    onShow() {
        
        //保存当前页面地址，登录页后回到这个页面
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'switchTab' };
        wx.setStorageSync('backUrl', backUrl);
        //聊天信息用的
        app.chatData.pageThis = this;
        app.chatData.chatPage = 'index';
        
        this.setData({ isLoginPopHide: true });
        //若有sessionId就直接加载(防止需要加载定时器影响加载速度)
        if (app.globalData.sessionId) {
            this.isReachIndex();
        } else {
            //sessionId是通过异步请求的，所以加了个定时器监听sessionid是否获取到了
            var timer = setInterval(() => {
                if (app.globalData.sessionId) {
                    clearInterval(timer);
                    this.isReachIndex();
                }
            }, 300);
        }

    },

    //判断是否刷新首页
    isReachIndex(){
        if (app.globalData.indexReach) {
            app.globalData.indexReach = false;

            //设置语言,判断是否切换语言
            app.loadLangNewFn(this, 'index', (res, lang) => {
                wx.setNavigationBarTitle({ title: res.indexTitle[lang] });  //设置当前页面的title
            });
            this.reachFn();
        } else {
            this.getNotification(); //获取通知公告数据消息数量
        }
    },

    //首次进入或重新登录刷新首页数据
    reachFn() {
        var lang = this.data.lang
        var parkName = this.data.langData.public.dfParkName[lang];  //顶部园区名称
        var loginInfo = app.globalData.loginInfo;
        var zgjAppData = app.globalData.app_zgj;
        var bOrder = false;

        if (loginInfo) {
            //顶部园区名称
            if (loginInfo.curParkName){
                parkName = loginInfo.curParkName;
            } else if (loginInfo.userInfo.parkInfo && loginInfo.userInfo.parkInfo.parkName){
                parkName = loginInfo.userInfo.parkInfo.parkName;
            }
            
            //设置跳转羊城招管家的参数
            var userPhone = loginInfo.userInfo.cellphone;
            zgjAppData.parame.mobileNo = userPhone ? userPhone : '';

            //获取用户信息后判断是否是园区管家或管理员，是的话就显示账单查询
            bOrder = loginInfo.userInfo.parkKeeper || loginInfo.userInfo.entAdmin;
        }
        this.setData({
            topParkName : parkName,
            zgjAppData  : app.globalData.app_zgj,
            orderIsShow : bOrder,
            loginInfo   : loginInfo,
            backLogReach: Math.random() + 1   //刷新加载待办
        });
        this.isParkInfo((res)=>{    //判断是否有房源分销数据
            this.loadMenuListFn(res);  //加载菜单
        })
        this.getNoticeData(); //顶部消息个数
        this.getNotification(); //获取通知公告数据消息数量
        this.getIndexSlide(); //顶部幻灯片
        this.getHouseList()     //获取房源户型列表
        this.getPolicyList(); //申报政策
        this.getHotActivityList();  //热门活动

    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.reachFn();  //页面刷新
        //审核中的话，刷新小程序首页会重新加载wxLogin(用于防止审核通过需要重新登录)
        var loginInfo = app.globalData.loginInfo;
        if (loginInfo && loginInfo.userInfo && loginInfo.userInfo.approveStatus == 'APPROVING'){
            wx.removeStorageSync('userInfo'); //清除之前缓存
            app.getWxLoginInfo();
        }
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //加载菜单栏
    loadMenuListFn(isRecommendInfo) {
        var moduleSwitch = app.globalData.moduleSwitch;
        var langMenuData = this.data.langData.menu;
        var lang = this.data.lang
        var recommendShow = (moduleSwitch.recommend && (isRecommendInfo == 1));
        var menuData = [
            {   //在线报修
                image: 'ico01', //图标
                title: langMenuData.repair[lang],  //标题
                typeName: 'repair', //类型
                link: '/pages/repair/online-repair/online-repair',  //跳转链接
                skipType: 'navigate', //跳转类型
                islogin: true, //是否需要登录才能访问
                visit: 0,  //访问量
                isShow: moduleSwitch.repair, //是否显示
            },
            {   //物资共享
                image: 'ico05',
                title: langMenuData.supplies[lang],
                typeName: 'supplies',
                link: '/pages/supplies/supplies-index/supplies-index',
                skipType: 'navigate',
                islogin: true,
                visit: 0,
                isShow: moduleSwitch.supplies,
            },
            {   //领券中心
                image: 'ico14',
                title: langMenuData.coupon[lang],
                typeName: 'coupon',
                link: '/pages/coupon/coupon-list/coupon-list',
                skipType: 'navigate',
                islogin: true,
                visit: 0,
                isShow: moduleSwitch.coupon,
            },
            {   //企业管家
                image: 'ico06',
                title: langMenuData.steward[lang],
                typeName: 'housekeeper',
                link: '/pages/common/company-housekeeper/company-housekeeper',
                skipType: 'navigate',
                islogin: true,
                visit: 0,
                isShow: true,
            },
            {   //账单查询
                image: 'ico02',
                title: langMenuData.order[lang],
                typeName: 'order',
                link: '/pages/order/order-list/order-list',
                skipType: 'navigate',
                islogin: true,
                visit: 0,
                isShow: moduleSwitch.order && this.data.orderIsShow,
            },
            {   //场地预定
                image: 'ico03',
                title: langMenuData.venue[lang],
                typeName: 'venue',
                link: '/pages/venue/venue-booking-list/venue-booking-list',
                skipType: 'navigate',
                islogin: true,
                visit: 0,
                isShow: moduleSwitch.venue,
            },
            {   //活动中心
                image: 'ico07',
                title: langMenuData.activity[lang],
                typeName: 'activity',
                link: '/pages/activity/activity-list/activity-list',
                skipType: 'navigate',
                islogin: false,
                visit: 0,
                isShow: moduleSwitch.activity,
            },
            {   //推荐有礼
                image: 'ico17',
                title: langMenuData.recommend[lang],
                typeName: 'recommend',
                link: '/pages/recommend/recommend-index/recommend-index',
                skipType: 'navigate',
                islogin: true,
                visit: 0,
                isShow: recommendShow,
            },
            {   //热门政策
                image: 'ico04',
                title: langMenuData.policy[lang],
                typeName: 'policy',
                link: '', //政策比较特殊，跳转有个函数跳的
                skipType: 'switchTab',
                islogin: false,
                visit: 0,
                isShow: true,
            },
            {   //访客预约
                image: 'ico11',
                title: langMenuData.visitor[lang],
                typeName: 'visitor',
                link: '/pages/visitor/visitor-appointment/visitor-appointment',
                skipType: 'navigate',
                islogin: true,
                visit: 0,
                isShow: moduleSwitch.visitor,
            },
            {   //新鲜事
                image: 'ico10',
                title: langMenuData.companyNews[lang],
                typeName: 'companyNews',
                link: '/pages/found/company-news-list/company-news-list',
                skipType: 'navigate',
                islogin: false,
                visit: 0,
                isShow: true,
            },
            {   //羊城招管家
                image: 'ico09',
                title: langMenuData.zgjApp[lang],
                typeName: 'merchantsSteward',
                link: '',
                skipType: 'navigate',
                islogin: false,
                visit: 0,
                isShow: moduleSwitch.zgjApp,
            },
            {   //扫码开门
                image: 'ico08',
                title: langMenuData.scanCode[lang],
                typeName: 'scancode',
                link: '/pages/visitor/scan-code/scan-code',
                skipType: 'navigate',
                islogin: true,
                visit: 0,
                isShow: moduleSwitch.scanCode,
            },
            {   //在线订餐
                image: 'ico12',
                title: langMenuData.orderfood[lang],
                typeName: 'orderfood',
                link: '',
                skipType: 'navigate',
                islogin: false,
                visit: 0,
                isShow: moduleSwitch.orderFood,
            },
            {   //投诉建议
                image: 'ico15',
                title: langMenuData.complaint[lang],
                typeName: 'complaint',
                link: '/pages/complaint/complaint-apply/complaint-apply',
                skipType: 'navigate',
                islogin: true,
                visit: 0,
                isShow: moduleSwitch.complaint,
            },
        ];

        //菜单栏排序
        // var menuInfo = wx.getStorageSync('menuInfo') ? wx.getStorageSync('menuInfo') : [];
        // if (menuInfo.length == 0) {
        //     //无缓存就把当前菜单加入缓存
        //     wx.setStorageSync('menuInfo', this.data.menuData);
        // } else {
        //     //先同步缓存里记录的点击数
        //     menuData.forEach(item => {
        //         menuInfo.forEach(item2 => {
        //             if (item.typeName == item2.typeName) {
        //                 item.visit = item2.visit;
        //             }
        //         });
        //     });
        // }

        // //按缓存里记录的点击数排序菜单
        // var list = [];
        // var showMenuNum = 0;
        // menuData.forEach(item => {
        //     var isPush = false;
        //     if (item.isShow) { showMenuNum++ };
        //     if (list.length == 0) {
        //         list.push(item); return;
        //     }
        //     list.forEach((item2, i) => {
        //         if (item.visit > item2.visit && !isPush) {
        //             list.splice(i, 0, item);
        //             isPush = true;
        //         }
        //     });
        //     if (!isPush) { list.push(item); }
        // });

        var showMenuNum = 0;
        menuData.forEach(item => {
            if (item.isShow) { showMenuNum++ }; 
        })

        this.setData({
            moduleSwitch: moduleSwitch,
            menuData: menuData,
            showMenuNum: showMenuNum
        });

    },

    //判断当前园区是否有房源分销信息
    isParkInfo(callback) {
        var _this = this;
        app.requestFn({
            isLoading: false,
            url: `/houseDistribution/onDist`,
            success: (res) => {
                callback && callback(res.data.data);
            }
        });
    },

    //展开收缩菜单
    moreMenuFn(e) {
        // var menuShowLen = this.data.menuData.filter(item => {
        //     return item.isShow
        // }).length;
        var menuHeight = this.data.moreMenuShow ? "380rpx" : (Math.ceil(this.data.showMenuNum / 4) * 190 + "rpx");
        this.setData({
            moreMenuShow: !this.data.moreMenuShow,
            menuHeight: menuHeight
        });
    },

    //点击菜单栏是否提示弹窗
    loginTipShow(e) {
        var dataItem = e.currentTarget.dataset.item;
        var url = dataItem.link;
        var islogin = dataItem.islogin;
        var gotoType = dataItem.skipType;
        var typeName = dataItem.typeName;
        //判断当前状态是否登录&&当前链接是否需要登录
        if (!app.globalData.isLogin && islogin) {
            this.setData({ isLoginPopHide: false });
        } else {
            var approveStatus = app.globalData.loginInfo.userInfo.approveStatus;  //企业审核认证状态
            if (approveStatus != 'ENABLED' && islogin) {
                wx.showToast({ title: this.data.langData.jurisdictionTip[lang], icon: 'none', duration: 3000 });
            } else {
                //设置缓存记录菜单访问的次数
                var menuInfo = wx.getStorageSync('menuInfo') ? wx.getStorageSync('menuInfo') : [];
                menuInfo.forEach(item => {
                    if (typeName == item.typeName && typeName != 'orderfood') { item.visit += 1; }
                });
                wx.setStorageSync('menuInfo', menuInfo);

                if (typeName == 'policy') {
                    this.morePolicyFn(); //跳转到政策页面
                } else if (!url) {
                    wx.showToast({ title: this.data.langData.buildTip[lang], icon: 'none', duration: 2000 });
                } else if (typeName == 'news') {
                    wx.switchTab({ url: url }); //跳转tab链接
                } else {
                    wx.navigateTo({ url: url }); //跳转链接
                }
            }
        };
    },

    //从组建获取待办的个数
    getBackLogTotal(e){
        var backLogIsShow = (e.detail.total && e.detail.total>0)?true:false;
        this.setData({ backLogIsShow: backLogIsShow })
    },

    //跳转消息列表页
    gotoChatFn(e) {
        if (!app.globalData.isLogin) {
            this.setData({ isLoginPopHide: false });
        } else {
            wx.navigateTo({ url: '/pages/wechat/chat-list/chat-list' }); //跳转链接
        }
    },

    //关闭登录提示弹窗
    closePopFn() {
        this.setData({ isLoginPopHide: true });
    },

    //顶部幻灯片切换导航点变化
    indexSlideChange(e){
        var curIndex = e.detail.current;
        this.setData({ indexSlideIndex: curIndex });
    },

    //获取幻灯片信息
    getIndexSlide() {
        app.requestFn({
            url: '/advert/list',
            data: {
                advertGroup: "applet_index_carousel"
            },
            success: (res) => {
                var slideData = res.data.data;
                slideData.forEach(item=>{
                    item.advertImg = item.advertImg ? item.advertImg : this.data.domainUrl + "/images/default/img_730_320.jpg"
                })
                this.setData({ indexSlide: slideData });
            }
        });
    },

    //幻灯片先记录，后跳转详情
    goToLink(e) {
        var _this = this;
        var slideItem = e.currentTarget.dataset.item;
        var gotoUrl = '';  //不同类型，跳转到不同的详情页
        switch (slideItem.targetType){  //类型
            case 'notice':  
                gotoUrl = '/pages/message/notice-details/notice-details?id=' + slideItem.targetAddress;
                break;
            case 'activity':
                gotoUrl = '/pages/activity/activity-details/activity-details?id=' + slideItem.targetAddress;
                break;
            case 'news':
                gotoUrl = '/pages/found/news-detail/news-detail?id=' + slideItem.targetAddress;
                break;
            case 'policy':
                gotoUrl = '/pagesfound/policy-detail/policy-detail?id=' + slideItem.targetAddress;
                break;
            case 'service':
                gotoUrl = '/pages/services/serve-detail/serve-detail?id=' + slideItem.targetAddress;
                break;
            case 'url':
                gotoUrl = '/pages/common/web-view/web-view?url=' + slideItem.targetAddress;  //调换h5地址
                break;
        }
        app.requestFn({
            url: `/advert/click?advertId=${slideItem.advertId}`,
            isLoading: false,
            method: 'POST',
            complete: (res) => {
                wx.navigateTo({ url: gotoUrl })
            }
        });
    },

    //获取通知公告列表数据
    getNoticeData() {
        var _this = this;
        app.requestFn({
            url: '/noticeInfoIndex',
            data: {},
            success: (res) => {
                var noticeData = res.data.data;
                _this.setData({ noticeData: noticeData });
            }
        });
    },

    //获取通知公告数据消息数量
    getNotification() {
        var _this = this;
        app.requestFn({
            isLoading: false,
            url: '/message/unreadCount',
            success: (res) => {
                var num2 = parseInt(res.data.data);
                app.requestFn({
                    isLoading: false,
                    url: '/notification',
                    success: (res) => {
                        var num = parseInt(res.data.data);
                        var msgStorage = wx.getStorageSync('msgStorage') ? wx.getStorageSync('msgStorage') : [];
                        var msgNum = msgStorage.reduce((prev, cur) => {
                            return cur.unread + prev
                        }, 0);
                        console.log('获取通知公告数据消息数量:', num, num2, msgNum, msgStorage)
                        _this.setData({
                            msgNum: num + msgNum + num2
                        });
                    }
                });
            }
        });
    },

    //招商户型列表
    getHouseList() {
        var _this = this;
        app.requestFn({
            url: `/houseDistribution/curUnitList`,
            data: {
                pageNum:1,
                pageSise:5
            },
            success: (res) => {
                var list = res.data.data;
                list.forEach(item=>{
                    item.areaResult = (item.biggestArea == item.smallestArea ? item.smallestArea: `${item.smallestArea}~${item.biggestArea}`)
                })
                _this.setData({ houseList: list });
            }
        });
    },
    

    //政策推荐列表
    getPolicyList() {
        var _this = this;
        app.requestFn({
            url: '/policy/recommendList',
            data: {},
            success: (res) => {
                var list = res.data.rows;
                list.forEach(function (item) {
                    if (item.highestReward > 10000) {
                        item.highestReward = parseInt(item.highestReward / 10000) + "万";
                    } else {
                        item.highestReward = item.highestReward ? (item.highestReward + "元") : null;
                    }
                    item.probability = parseInt(item.probability);
                });
                list = list.slice(0, 5);  //截取前五条
                _this.setData({ policyList: list });
            }
        });
    },

    //政策跳转详情
    goToPolicy(e) {
        var policyId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/found/policy-detail/policy-detail?id=' + policyId
        })
    },

    //热门活动列表
    getHotActivityList() {
        var _this = this;
        app.requestFn({
            url: '/activity/indexList',
            data: {},
            success: (res) => {
                var list = res.data.rows;
                list = list.slice(0, 5);
                this.setData({ hotActList: list });
            }
        });
    },


    //图片加载失败显示默认图
    errorImgFn(e) {
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

    //返回顶部按钮
    backTopFn() {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        })
    },

    //监听滚动判断是否显示返回顶部按钮
    onPageScroll(e) {
        if (e.scrollTop > 800 && !this.data.backTopShow) {
            this.setData({ backTopShow: true });
        } else if (e.scrollTop < 800 && this.data.backTopShow){
            this.setData({ backTopShow: false });
        }
    },

    //更多政策
    morePolicyFn() {
        app.globalData.foundTag = 1;
        wx.switchTab({
            url: '/pages/menu-tabs/found-index/found-index'
        });
    },

    //转发
    onShareAppMessage: function () {

    }

})