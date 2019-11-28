const app = getApp(); //获取应用实例
const commonFn = require('../../utils/common.js'); //一些通用的函数
const listFn = require('../../utils/list.js'); //通用列表函数

Component({

    //组件的属性列表
    properties: {
        targetPage: String,

        reachData: {
            type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {
                if (this.data.isFirst){
                    this.setData({ isFirst:false })
                    app.loadLangNewFn(this, 'cpActivityList');
                }
                
                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal > 1) {
                    this.setData({ ['listInfo.pageNum']: 1 });
                };
                this.loadMoreListFn();
            }
        }
    },

    //组件的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        listInfo: {},   //列表数据
        listName: '',  //搜藏页面添加的class    
        hasUserInfo: true, //是否有用户信息
        targetName: 'activity',  //暂无目标页面
        isFirst:true,

        langData: null,  //语言数据
    },

    /**-------- 组件加载完成后 ---------**/
    attached() {
       
        //搜藏页才需要加类collect
        var l_name = (this.properties.targetPage == "collect") ? "collect" : "";
        this.setData({
            targetName: 'activity_collect',
            listName: l_name
        });

    },

    /**-------- 组件的方法列表 ---------**/
    methods: {

        //获取列表数据
        getListInfo(isReach) {
            var _this = this;
            var langData = _this.data.langData;
            var lang = this.data.lang
            var url = '/activity/list'; //活动列表
            if (this.properties.targetPage == "collect") {
                url = '/activityCollection/activityList';   //我的活动收藏接口
            } else if (this.properties.targetPage == "my_activity") {
                url = '/activityUser/joinedActList';  //已报名活动接口
            }
            listFn.listPage({
                url: url,
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
                        //循环数组转换时间戳
                        listItem.beginTime = commonFn.getDate(listItem.beginTime).slice(5, 16);
                        listItem.endTime = commonFn.getDate(listItem.endTime).slice(5, 16);
                        
                        switch (listItem.status) {
                            case 1:
                                listItem.statusClass = 's_purple';
                                listItem.statusName = langData.status1[lang];
                                break;
                            case 2:
                                listItem.statusClass = 's_yellow';
                                if (listItem.personCount == listItem.joinCount){    //判断是否报名满员
                                    listItem.statusName = langData.fullPerson[lang]
                                }else{
                                    listItem.statusName = langData.status2[lang]
                                }
                                break;
                            case 3:
                                listItem.statusClass = 's_blue';
                                listItem.statusName = langData.status3[lang]
                                break;
                            case 4:
                                listItem.statusClass = 's_blue';
                                listItem.statusName = langData.status4[lang]
                                break;
                            case 5:
                                listItem.statusClass = 's_gray';
                                listItem.statusName = langData.status5[lang]
                                break;
                            case 6:
                                listItem.statusClass = 's_gray';
                                listItem.statusName = langData.status6[lang]
                                break;
                        }
                    }
                    return listItem;
                },
                success: () => {
                    //console.log("活动接口：", _this.data.listInfo);
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

        //跳转到详情页
        gotoDetailsFn(e) {
            var id = e.currentTarget.dataset.activity_id;
            wx.navigateTo({
                url: '/activity/activity-details/activity-details?id=' + id,
            });
        },

        //点击我要报名
        applyBtnFn(e) {
            var formId = e.detail.formId;
            var url = e.currentTarget.dataset.url;
            if (!app.globalData.isLogin) {
                this.setData({ hasUserInfo: false });
            } else {
                app.getFormIdFn(formId, () => {
                    wx.navigateTo({ url: url });
                })
            }
        },

        //关闭登录提示弹窗
        closePopFn() {
            this.setData({ hasUserInfo: true });
        },

        //打开收藏弹窗
        collectPopShow(e) {
            this.triggerEvent('collectPopShow', { type: 'activity', id: e.currentTarget.dataset.id });
        },

        //图片加载失败显示默认图
        errorImgFn(e) {
            //有三个参数：当前页面this，要替换的对象，替换图片地址
            commonFn.errorImg(this, e.currentTarget.dataset.obj);
        }
    }
})