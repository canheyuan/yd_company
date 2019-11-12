const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        lang: '',    //语言类型
        
        isSearch:false, //是否是搜索模块
        searchTxt:'',   //搜索关键词
        supplierId:'',  //服务商id
        categoryId: '',  //分类id,测试：49b1db395cd653a2d22f1aae986e9397
        screenList: null,    //筛选头部数据
        listReach:null, //刷新
        screenIndex:0,  //筛选索引
        screenPopHide:true, //筛选弹窗是否隐藏

    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        this.setData({
            isSearch: options.search ? true:false,
            searchTxt: options.search ? options.search :'',
            categoryId: options.c_id ? options.c_id:''
        })
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve', (res, lang) => {
            var pageTitle = options.title ? options.title : res.listTitle[lang]
            wx.setNavigationBarTitle({ title: pageTitle });  //设置当前页面的title
            this.setData({
                screenList: [
                    {
                        //sortClass，升序：up，降序：down
                        index: 0,  orderType: 1, isAsc: 2, popHide: true, sortClass: '',  
                        son: [
                            { name: res.tagName01[lang], orderType: 1},
                            { name: res.tagName02[lang], orderType: 1 },
                            { name: res.tagName03[lang], orderType: 2}
                        ]
                    },
                    {
                        index: 0, orderType: 3, isAsc: 2, popHide: true, sortClass: '',
                        son: [
                            { name: res.tagName04[lang], orderType: 3 }
                        ]
                    },
                    {
                        index: 0,  orderType: 4, isAsc: 2, popHide: true, sortClass: '', 
                        son: [
                            { name: res.tagName05[lang], orderType: 4 },
                        ]
                    },
                ],
                listReach:1.1
            })
        });
    },

    //筛选选项卡
    tagChangeFn(e) {
        var pIndex = e.currentTarget.dataset.index
        var parentItem = this.data.screenList[pIndex]
        var screenIndex = this.data.screenIndex;
        
        if (parentItem.son.length > 1) {   //子项一个以上

            var screenPopHide = !this.data.screenPopHide
            this.setData({
                screenIndex: pIndex,
                screenPopHide: screenPopHide,
            })

        } else if (parentItem.son.length == 1) {

            var screenPopHide = true
            if (screenIndex == pIndex) {    //判断点击的是否是同一个父选项
                parentItem.isAsc = parentItem.isAsc == 1 ? 2 : 1;
                parentItem.sortClass = parentItem.isAsc == 1 ? 'up' : 'down'
            }else{
                parentItem.isAsc = 2   //每次切换默认排序2
                parentItem.sortClass = 'down'
            }
            this.setData({
                screenIndex: pIndex,
                screenPopHide: screenPopHide,
                ['screenList[' + pIndex + ']']: parentItem,
                listReach: Math.random() + 1, //刷新列表
            })
        } 
    },

    //筛选子选项卡
    tagChangeSonFn(e) {
        var pIndex = e.currentTarget.dataset.pindex;
        var index = e.currentTarget.dataset.index;
        var orderType = e.currentTarget.dataset.type
        var parentItem = this.data.screenList[pIndex];

        
        if (parentItem.index == index){
            parentItem.isAsc = parentItem.isAsc == 1 ? 2 : 1
        }else{
            parentItem.isAsc = 2
        }
        parentItem.index = index;
        parentItem.orderType = orderType;
        
        this.setData({
            screenPopHide: true,
            ['screenList[' + pIndex + ']']: parentItem,
            listReach: Math.random() + 1, //刷新列表
        })
    },

    //搜索服务
    searchServeFn(e){
        var val = e.detail.value
        this.setData({
            searchTxt: val,
            listReach:Math.random() + 1
        })
    },

    //关闭弹窗
    closeMaskFn(e) {
        this.setData({ screenPopHide: true })
    },

    //上拉加载更多
    onReachBottom: function (e) {
        var reachObj = 'tagList[' + this.data.tagIndex + '].reach';
        this.setData({ [reachObj]: Math.random() });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        var reachObj = 'tagList[' + this.data.tagIndex + '].reach';
        this.setData({ [reachObj]: Math.random() + 1 });
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //监听滚动判断是否显示返回顶部按钮
    onPageScroll(e) {
        if (e.scrollTop > 800 && !this.data.backTopShow) {
            this.setData({ backTopShow: true });
        } else if (e.scrollTop < 800 && this.data.backTopShow) {
            this.setData({ backTopShow: false });
        }
    },
})