
const app = getApp();
const commonFn = require('../../utils/common.js');  //一些通用的函数
const listFn = require('../../utils/list.js'); //通用列表函数

Component({

    //组件的属性列表
    properties: {
        targetPage: String, //目标页面

        //是否已收藏
        isCollected: {
            type: String,
            observer: function (newVal, oldVal, changedPath) {
                this.setData({ isCollect: newVal });
            }
        },
        detailId: String,   //详情页id

        reachData: {
            type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {
                if (this.data.isFirst) {
                    this.setData({ isFirst: false })
                    //设置语言,判断是否切换语言
                    app.loadLangNewFn(this, 'cpDiscussList');
                }

                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal > 1) {
                    this.setData({ ['discussInfo.pageNum']: 1 });
                };
                this.loadMoreListFn();
            }
        },
    },

    //组件的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        isFirst:true,
         //评论列表数据
        discussInfo: {
            pageSize:20
        },  
        apiData:{
            //活动(键值名称和targetPage接受的名称一致)
            activity: {
                listUrl:'/activityComment/list',    //列表接口地址
                addCollectUrl:'/activityCollection/add',    //加收藏
                delCollectUrl:'/activityCollection/remove/',//取消收藏
                addLikeUrl:'/activityCommentLike/add',  //点赞
                delLikeUrl:'/activityCommentLike/remove/',  //取消赞
                addDiscussUrl: '/activityComment/add',   //添加评论
                detailIdName:'activityId',    //详情id名称
                commentIdName:'actCommId'   //评论id
            },
            //新闻消息
            news:{
                listUrl: '/newsComment/list',    //列表接口地址
                addCollectUrl: '/newsCollection/add',    //加收藏
                delCollectUrl: '/newsCollection/remove/',//取消收藏
                addLikeUrl: '/newsCommentLike/add',  //点赞
                delLikeUrl: '/newsCommentLike/remove/',  //取消赞
                addDiscussUrl: '/newsComment/add',   //添加评论
                detailIdName: 'newsId',    //详情id名称
                commentIdName: 'newsCommId'   //评论id
            }
        },
        
        isCollect: null,   //是否收藏
        discussContent: '', //评论内容
        isLoginPopHide: true,   //登录提示弹窗是否隐藏
        isLogin: false ,    //是否登录
    },

    attached() {
        //获取登录状态
        this.setData({ isLogin: app.globalData.isLogin })
    },

    //组件的方法列表
    methods: {
        //滚动到评论位置
        scrollDiscussFn() {
            this.triggerEvent('scrollDiscussFn');
        },

        //打开登录提示
        loginTipShowFn(e){
            this.setData({ isLoginPopHide: false });
        },


        //获取列表数据
        getListInfo(isReach) {
            //console.log('获取列表数据')
            var _this = this;
            var targetPage = _this.properties.targetPage
            var apiActData = this.data.apiData[targetPage];
            var formData = {};
            formData[apiActData.detailIdName] = _this.properties.detailId;
            listFn.listPage({
                isLoading: false,
                url: apiActData.listUrl,
                isReach: isReach,
                data: formData,
                page: _this,
                listDataName: 'discussInfo',
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
                        listItem.commentId = listItem[apiActData.commentIdName]
                        listItem.createTime = commonFn.getDate(listItem.createTime); //列表循环数组转换时间戳
                    }
                    return listItem;
                },
                success: (res) => {
                    //console.log("评论列表：", _this.data.discussInfo);
                }
            });
        },

        //上拉到底部加载更多函数
        loadMoreListFn: function () {
            var _this = this;
            var listInfo = this.data.discussInfo;
            listFn.listLoadMore({
                pageNum: listInfo.pageNum,
                pageSize: listInfo.pageSize,
                pageTotal: listInfo.pageTotal,
                getListFn: (isReach) => {
                    _this.getListInfo(isReach);
                }
            })
        },

        //点赞/取消赞
        setlikeFn(e) {
            var _this = this;
            var likeCode = e.currentTarget.dataset.like_code;
            var actCommId = e.currentTarget.dataset.id;
            var index = e.currentTarget.dataset.index;
            var targetPage = _this.properties.targetPage
            var apiActData = this.data.apiData[targetPage];

            if (likeCode == 2){
                //点赞
                var formData = {};
                formData[apiActData.commentIdName] = actCommId;
                app.requestFn({
                    isLoading:false,
                    url: apiActData.addLikeUrl,
                    data: formData,
                    method: 'POST',
                    success: (res) => {
                        var discussList = _this.data.discussInfo.list;
                        discussList[index].isLiked = 1;  //改变点赞状态
                        discussList[index].likeNum++;  //自加点赞数
                        this.setData({ ['discussInfo.list']: discussList });
                    }
                });
            }else{
                //取消赞
                app.requestFn({
                    isLoading:false,
                    url: apiActData.delLikeUrl + actCommId,
                    method: 'DELETE',
                    success: (res) => {
                        var discussList = _this.data.discussInfo.list;
                        discussList[index].isLiked = 2;  //改变点赞状态
                        discussList[index].likeNum--;  //自减点赞数
                        this.setData({ ['discussInfo.list']: discussList });
                    }
                }); 
            }
        },

        //添加取消收藏活动
        collectFn() {
            //添加收藏活动
            var _this = this;
            var langData = this.data.langData
            var lang = this.data.lang
            var targetPage = _this.properties.targetPage
            var apiActData = this.data.apiData[targetPage];

            if (_this.data.isCollect == 2) {
                var formData = {};
                formData[apiActData.detailIdName] = _this.properties.detailId;
                app.requestFn({
                    isLoading: false,
                    url: apiActData.addCollectUrl,
                    data: formData,
                    method: 'POST',
                    success: (res) => {
                        wx.showToast({ title: langData.collectTip[lang], icon: 'success', duration: 2000 });
                        _this.setData({ isCollect: 1 });
                    }
                });

            } else if (_this.data.isCollect == 1) {
                //取消收藏
                app.requestFn({
                    isLoading: false,
                    url: apiActData.delCollectUrl + _this.properties.detailId,
                    method: 'DELETE',
                    success: (res) => {
                        wx.showToast({ title: langData.unCollectTip[lang], icon: 'success', duration: 2000 });
                        _this.setData({ isCollect: 2 });
                    }
                });
            }

        },

        //输入评论
        writeDiscuss(e) {
            this.setData({ discussContent: e.detail.value });
        },

        //添加评论
        addDiscussFn() {
            var _this = this;
            var targetPage = _this.properties.targetPage
            var apiActData = this.data.apiData[targetPage];
            var message = _this.data.discussContent
            var formData = {
                content: message
            };
            formData[apiActData.detailIdName] = _this.properties.detailId;
            app.msgSecCheck(message,(res)=>{
                app.requestFn({
                    isLoading: false,
                    url: apiActData.addDiscussUrl,
                    data: formData,
                    method: 'POST',
                    dataType: 'json',
                    success: (res) => {
                        _this.setData({
                            ['discussInfo.pageNum']: 1,
                            discussContent: ''   //重置输入框
                        });
                        _this.getListInfo(true);
                        _this.scrollDiscussFn();
                    }
                });
            });
        },

        //关闭登录提示弹窗
        closePopFn() {
            this.setData({ isLoginPopHide: true });
        },

        //图片加载失败显示默认图
        errorImgFn(e) {
            //有三个参数：当前页面this，要替换的对象，替换图片地址
            commonFn.errorImg(this, e.currentTarget.dataset.obj);
        }
    }
})
