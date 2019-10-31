const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型
        tagList: [
            { name: '全部', type: 1, reach: 1, show: true },
            { name: '待开始', type: 2, reach: 1, show: false },
            { name: '服务中', type: 3, reach: 1, show: false },
            { name: '已完成', type: 4, reach: 1, show: false }
        ],
        tagIndex: 0,
        
        //筛选头部数据
        screenList:[
            { 
                index: 0, type: 1, reach: 1, popHide: true, sortClass:'', //sortClass，升序：up，降序：down
                son:[   
                    { name: '默认排序' , type: 1 },
                    { name: '发布时间' , type: 1},
                    { name: '咨询量' , type: 1 }
                ]
            },
            { 
                index: 0, type: 1, reach: 1, popHide: true, sortClass: '',
                son:[
                    { name: '销量', type: 1 }
                ]
            },
            {
                index: 0, type: 1, reach: 1, popHide: true, sortClass: '',
                son: [
                    { name: '价格', type: 1 },
                ]
            },
        ],
        screenIndex:0,
        screenPopHide:true,

    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'services', (res) => {
            //wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });
    },

    //生命周期函数--监听页面显示
    onShow: function () {
        
    },

    //筛选选项卡
    tagChangeFn(e) {
        var pIndex = e.currentTarget.dataset.index;
        var parentItem = this.data.screenList[pIndex];
        if (parentItem.son.length > 1) {   //子项一个以上
            var screenPopHide = !this.data.screenPopHide;
        } else if (parentItem.son.length == 1) {
            var screenPopHide = true;
            parentItem.sortClass = parentItem.sortClass == 'down' ? 'up' : 'down';
        }
        this.setData({
            ['screenList[' + pIndex + ']']: parentItem,
            screenIndex: pIndex,
            screenPopHide: screenPopHide,
        })
    },

    //筛选子选项卡
    tagChangeSonFn(e) {
        var pIndex = e.currentTarget.dataset.pindex;
        var index = e.currentTarget.dataset.index;
        var parentItem = this.data.screenList[pIndex];
        parentItem.index = index;
        this.setData({
            screenPopHide: true,
            ['screenList[' + pIndex + ']']: parentItem
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
})