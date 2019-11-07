const app = getApp(); //获取应用实例

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        lang: '',    //语言类型

        detailData:null,
        
        //筛选头部数据
        screenList: null,
        screenIndex: 0,
        screenPopHide: true,
        
        serveList: [
            { title: '商标注册服务商标注册服务商标注册服务商标注册服务商标注册服务商标注册服务商标注册服务商标注册服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' },
            { title: '企业形象策划服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' },
            { title: '科技项目代理服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' },
            { title: '商标注册服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' },
            { title: '商标注册服务商标注册服务商标注册服务商标注册服务商标注册服务商标注册服务商标注册服务商标注册服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' },
            { title: '企业形象策划服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' },
            { title: '科技项目代理服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' },
            { title: '商标注册服务', xiaoliang: '103', zixun: '112', price: '￥1000', y_price: '￥1200' }
        ],
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'serve', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.title[lang] });  //设置当前页面的title
            this.setData({
                screenList: [
                    {
                        index: 0, type: 1, reach: 1, popHide: true, sortClass: '', show: true, //sortClass，升序：up，降序：down
                        son: [
                            { name: res.tagName01[lang], type: 1 },
                            { name: res.tagName02[lang], type: 1 },
                            { name: res.tagName03[lang], type: 1 }
                        ]
                    },
                    {
                        index: 0, type: 1, reach: 1, popHide: true, sortClass: '', show: false,
                        son: [
                            { name: res.tagName04[lang], type: 1 }
                        ]
                    },
                    {
                        index: 0, type: 1, reach: 1, popHide: true, sortClass: '', show: false,
                        son: [
                            { name: res.tagName05[lang], type: 1 },
                        ]
                    },
                ]
            })
        });
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    //获取详情
    getDetailFn(id) {
        var _this = this;
        app.requestFn({
            url: `${id}`,
            success: (res) => {
                var detailData = res.data.data;
                this.setData({ detailData: detailData });
            }
        })
    },

    //筛选选项卡
    tagChangeFn(e) {
        var pIndex = e.currentTarget.dataset.index;
        var parentItem = this.data.screenList[pIndex];
        if (parentItem.son.length > 1) {   //子项一个以上
            var screenPopHide = !this.data.screenPopHide;
        } else if (parentItem.son.length == 1) {
            var screenPopHide = true;
            parentItem.sortClass = parentItem.sortClass == 'down'?'up':'down';
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
    closeMaskFn(e){
        this.setData({ screenPopHide: true  })
    },

    

    

    


    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {

    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {

    },

    //用户点击右上角分享
    onShareAppMessage: function () {

    }
})