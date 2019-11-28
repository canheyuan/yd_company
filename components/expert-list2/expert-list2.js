const app = getApp(); //获取应用实例
const commonFn = require('../../utils/common.js');
const regionData = require('../../utils/region-data.js');
const listFn = require('../../utils/list.js'); //通用列表函数

Component({
    //组件的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        listInfo: {},  //列表
        isFirst:true,
        langData: null,  //语言数据
    },

    //组件的属性列表
    properties: {
        targetPage: String,

        //刷新数据
        reachData: {
            type: Number, // 类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {
                if (this.data.isFirst) {
                    this.setData({ isFirst: false })
                    app.loadLangNewFn(this, 'cpExpertList');
                }
                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal > 1) {
                    this.setData({ ['listInfo.pageNum']: 1 });
                };
                this.loadMoreListFn();
            }
        }
    },

    //组件的方法列表
    methods: {
        //跳转到详情页
        gotoDetailsFn(e) {
            var exId = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/found/expert-detail/expert-detail?id=' + exId
            })
        },

        //获取列表数据
        getListInfo(isReach) {
            var _this = this;
            listFn.listPage({
                url: `/expertAttention/expertList`,
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
                        listItem.cityName = regionData.regionData(listItem.cityId);
                    }
                    return listItem;
                },
                success: (res) => {
                    //console.log("收藏专家列表接口：", _this.data.listInfo);
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

        //图片加载失败显示默认图
        errorImgFn(e) {
            //有三个参数：当前页面this，要替换的对象，替换图片地址
            commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
        },

        //打开弹窗
        collectPopShow(e) {
            console.log("点击收藏按钮")
            this.triggerEvent('collectPopShow', { type: 'expert', id: e.currentTarget.dataset.id });
        }

    }
})

