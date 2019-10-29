
const app = getApp(); //获取应用实例
const listFn = require('../../utils/list.js'); //通用列表函数
const commonFn = require('../../utils/common.js');  //一些通用的函数

Component({
    //组件的属性列表
    properties: {
        targetPage: String,
        typeShow: Boolean,
        reachData: {
            type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {
                
                if (this.data.isFirst && this.properties.typeShow){
                    this.setData({ isFirst :false });
                    this.getNewTypeListFn((res)=>{
                        //随机数大于1：刷新。小于1：上拉刷新
                        if (newVal > 1) {
                            this.setData({ ['listInfo.pageNum']: 1 });
                        };
                        this.loadMoreListFn();
                    })
                }else{
                    //随机数大于1：刷新。小于1：上拉刷新
                    if (newVal > 1) {
                        this.setData({ ['listInfo.pageNum']: 1 });
                    };
                    this.loadMoreListFn();
                }
            }
        }
    },

    data: {
        domainUrl: app.globalData.domainUrl,
        newsTypeList:[],    
        newsTypeIndex:0,
        isFirst:true,
        listInfo: {}   //列表数据
    },

    //组件加载完成后
    attached() {
        
    },

    //组件的方法列表
    methods: {

        //获取列表数据
        getListInfo(isReach) {
            var _this = this;
            var url = _this.properties.targetPage == 'collect' ? '/newsCollection/newsList' : '/news/list';
            var targetPage = this.properties.targetPage
            var newsType = null
            switch (targetPage){
                case 'companyNews':
                    newsType = 25;
                    break;
                case 'news':
                    newsType = _this.data.newsTypeList[_this.data.newsTypeIndex].code
                    break;
            }
            var formData = newsType ? { newsType: newsType}:{}
            listFn.listPage({
                url: url,
                data: formData,
                isReach: isReach,
                page: _this,
                listDataName: 'listInfo',
                getListDataFn: (listdata) => {
                    //返回列表数据和总数
                    return {
                        list: listdata.rows,
                        total: listdata.total
                    }
                },
                disposeFn: (listItem) => {
                    //对列表循环操作改变数据
                    var listItem = listItem;
                    if (listItem) {
                        listItem.publishTime = commonFn.getDate(listItem.publishTime).substr(0, 16); //列表循环数组转换时间戳
                    }
                    return listItem;
                },
                success: (res) => {
                    console.log("资讯列表：", _this.data.listInfo);
                }
            });
        },

        //上拉到底部加载更多函数
        loadMoreListFn: function () {
            var _this = this;
            var listInfo = this.data.listInfo;
            listFn.listLoadMore({
                pageNum: listInfo.pageNum,
                pageSize: listInfo.pageSize,
                pageTotal: listInfo.pageTotal,
                getListFn: (isReach) => {
                    _this.getListInfo(isReach);
                }
            })
        },

        //记录后跳转到新闻详情
        goToNew(e) {
            var newsId = e.currentTarget.dataset.id;
            var index = e.currentTarget.dataset.index;
            var newItem = this.data.listInfo.list[index];
            newItem.pv = newItem.pv + 1;
            
            app.requestFn({
                isLoading: false,
                url: `/news/click?newsId=${newsId}`,
                method: 'POST',
                complete: (res) => {
                    this.setData({
                        ['listInfo.list[' + index + ']']: newItem
                    })
                    wx.navigateTo({ url: `/pages/found/news-detail/news-detail?id=${newsId}` });
                }
            });
        },

        //获取资讯类型列表
        getNewTypeListFn(cbOk) {
            app.requestFn({
                url: `/news/newsTypeList`,
                success: (res) => {
                    console.log('资讯类型：', res.data);
                    this.setData({
                        newsTypeList: res.data.data
                    })
                    cbOk && cbOk(res.data);
                }
            });
        },

        //类型切换
        newsTypeTagFn(e){
            var index = e.currentTarget.dataset.index;
            this.setData({ 
                newsTypeIndex:index,
                ['listInfo.pageNum']: 1 
            });
            this.loadMoreListFn();
        },

        /**-------- 打开弹窗 ---------**/
        collectPopShow(e) {
            this.triggerEvent('collectPopShow', { type: 'news', id: e.currentTarget.dataset.id });
        },

        //图片加载失败显示默认图
        errorImgFn(e) {
            //有三个参数：当前页面this，要替换的对象，替换图片地址
            commonFn.errorImg(this, e.currentTarget.dataset.obj);
        },
    }
})