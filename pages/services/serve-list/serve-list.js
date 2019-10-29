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
        
        screenList:[
            { 
                index: 0, type: 1, reach: 1, popHide: true, sort:0,
                son:[
                    { name: '默认排序' , type: 1 },
                    { name: '发布时间' , type: 1},
                    { name: '咨询量' , type: 1 }
                ]
            },
            { 
                index: 0, type: 1, reach: 1, popHide: true, sort: 0,
                son:[
                    { name: '销量', type: 1 },
                    { name: '咨询量', type: 1 }
                ]
            },
            {
                index: 0, type: 1, reach: 1, popHide: true, sort: 0,
                son: [
                    { name: '价格', type: 1 },
                ]
            },

        ],

    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'services', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });
    },

    //生命周期函数--监听页面显示
    onShow: function () {
        
    },

    //所有选项卡弹窗关闭
    allScreenPopHide(i){
        var screenList = this.data.screenList;
        screenList.forEach((item,index)=>{
            item.popHide = (i == index) ? !item.popHide : true;
        })
        this.setData({ screenList: screenList })
    },

    //点击选项卡
    changeScreenFn(e){
        var index = e.currentTarget.dataset.index;
        var screenItem = this.data.screenList[index];
        if (screenItem.son.length>1){   //子项一个以上
            this.allScreenPopHide(index);
        } else if (screenItem.son.length = 1){
            this.allScreenPopHide();
            console.log('执行刷新页面')
        }
    },

    //点击选项卡子选项
    changeScreenSonFn(e){
        var pIndex = e.currentTarget.dataset.pindex;
        var index = e.currentTarget.dataset.index;
        var screenItem = this.data.screenList[pIndex];
        screenItem.popHide = true;
        screenItem.index = index;
        this.setData({
            ['screenList[' + pIndex + ']']: screenItem
        })
    },

    //选项卡切换
    tagChangeFn(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            ['tagList[' + index + '].show']: true,
            tagIndex: index
        });
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