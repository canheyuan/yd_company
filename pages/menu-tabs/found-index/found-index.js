
const commonFn = require('../../../utils/common.js'); //一些公用的函数
const app = getApp();  //获取应用实例
var chatIm = require('../../../utils/chatIm.js');
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        tagList: [
            { title: '', isShow: false, reach: null },
            { title: '', isShow: false, reach: null }
        ],
        tagIndex: 0, //0现实新鲜事，1现实政策


        newsSlideData: null,  //新闻幻灯片数据
        newsSlideTotal: 0,    //新闻幻灯片总数

        expertList: null,  //专家列表
        expertListTotal: 0,  //专家列表数量

        policyTitleList: null, //政策title列表
        navWidth: 0,  //政策title总宽度
        policyType: "",  //政策类型

        isLoginPopHide: true,   //登录提示弹窗是否隐藏

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onShow() {
        //保存当前页面地址，登录页后回到这个页面
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'switchTab' };
        wx.setStorageSync('backUrl', backUrl);

        app.chatData.pageThis = this;

        //设置显示哪一块内容,资讯0或政策1
        var tagIndex = app.globalData.foundTag ;
        this.setData({
            isLoginPopHide: true,
            tagIndex: tagIndex
        });

        if (app.globalData.foundReach) {    //是否加载发现页面
            app.globalData.foundReach = false;

            var policyTitleList = this.data.policyTitleList;
            var tagList = this.data.tagList;
            tagList[0].isShow = false;
            tagList[1].isShow = false;
            //设置语言,判断是否切换语言
            app.loadLangNewFn(this, 'foundIndex', (res, lang) => {
                wx.setNavigationBarTitle({ title: res.foundTitle[lang] });  //设置当前页面的title
                policyTitleList = [{ indTypeKey: "recommend", indTypeName: res.recommendTitle[lang], policyNum: 0 }];
                tagList[0].title = res.tagNews[lang];
                tagList[1].title = res.tagPolicy[lang];
            });
            this.setData({
                policyTitleList: policyTitleList,
                tagList: tagList
            });

            this.reachFn();
        }else{
            //专家列表是否刷新
            if (app.globalData.expertReach && tagIndex == 1 && this.data.tagList[1].isShow) {
                app.globalData.expertReach = false
                this.getExperList();  //获取专家列表
            }
        }
    },

    //选项卡切换
    tagChange(e) {
        
        var index = e.currentTarget.dataset.index;
        var nowItemShow = this.data.tagList[index].isShow;
        this.setData({ tagIndex: index });
        app.globalData.foundTag = index;
        if (!nowItemShow){  //首次加载用到
            this.reachFn();
        }
    },

    //刷新新鲜事页面
    reachNewsFn(){
        this.getnewsSlide(); //获取幻灯片资讯列表
        this.setData({
            ['tagList[0].reach']: Math.random() + 1,
            ['tagList[0].isShow']: true
        });
    },

    //刷新政策页面
    reachPolicyFn(){
        this.getExperList();  //获取专家列表
        this.getTitleList(); //获取政策title列表
        this.setData({
            ['tagList[1].isShow']: true
        });
    },

    //刷新页面
    reachFn(){
        var index = this.data.tagIndex;
        if (index == 0) {
            this.reachNewsFn();
        } else {
            this.reachPolicyFn();
        }
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.reachFn();
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //获取顶部幻灯片数据
    getnewsSlide() {
        app.requestFn({
            url: '/news/list',
            data: {
                location: "carousel"
            },
            success: (res) => {
                var list = res.data.rows;
                var total = res.data.total > 10 ? 10 : res.data.total;
                //只取前十个
                list.filter((item, index)=>{
                    return index<10
                })
                list.forEach(item=>{
                    item.bannerImg = item.mainImgList[0] ? item.mainImgList[0] : this.data.domainUrl + "/images/default/img_730_320.jpg"
                })

                this.setData({
                    newsSlideData: list,
                    newsSlideTotal: total
                })
            }
        });
    },

    //记录后跳转到新闻详情
    goToNew(e) {
        var newsId = e.currentTarget.dataset.newid;
        app.requestFn({
            isLoading: false,
            url: `/news/click?newsId=${newsId}`,
            method: 'POST',
            complete: (res) => {
                wx.navigateTo({ url: `/found/news-detail/news-detail?id=${newsId}` });
            }
        });
    },

    //获取专家列表
    getExperList() {
        app.requestFn({
            isLoading: false,
            url: `/expert/list`,
            success: (res) => {
                var list = res.data.rows;
                var total = res.data.total;
                this.setData({
                    expertList: list,
                    expertListTotal: total
                });
            }
        });
    },

    //跳转专家详情
    goToExpert(e) {
        var exId = e.currentTarget.dataset.exid;
        wx.navigateTo({ url: `/found/expert-detail/expert-detail?id=${exId}` });
    },

    //关闭登录提示弹窗
    closePopFn() {
        this.setData({ isLoginPopHide: true });
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
        });
    },

    //获取政策行业title类型列表
    getTitleList() {
        app.requestFn({
            url: `/policy/indTypeList`,
            success: (res) => {
                var list = res.data.data;
                //获取第一条推荐
                var list2 = this.data.policyTitleList.filter((item, i) => {
                    return i == 0
                });
                list = list2.concat(list);
                this.setData({
                    policyTitleList: list,
                    navWidth: list.length * 220 + 60,
                    policyType: list[0].indTypeKey
                })
                this.setData({ ['tagList[1].reach']: Math.random() + 1 }); //加载完加载政策推荐列表
            }
        });
    },

    //组件传递过来的政策推荐个数
    recommendTotalFn(e) {
        this.setData({ ["policyTitleList[0].policyNum"]: e.detail });
    },

    //切换政策
    policyTag(e) {
        var key = e.currentTarget.dataset.key;
        this.setData({ policyType: key });
        this.setData({ ['tagList[1].reach']: Math.random() + 1 }); //加载完加载政策推荐列表
    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {
        var tagIndex = this.data.tagIndex;
        this.setData({ ['tagList[' + tagIndex + '].reach']: Math.random() });
    },
})