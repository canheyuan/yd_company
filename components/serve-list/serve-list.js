const app = getApp(); //获取应用实例
const commonFn = require('../../utils/common.js'); //一些通用的函数
const listFn = require('../../utils/list.js'); //通用列表函数

Component({

    //组件的属性列表
    properties: {
        targetPage: String,
        orderType:String,
        isAsc:String,
        categoryId:String,
        supplierId:String,
        reachData: {
            type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {
                if (this.data.isFirst) {
                    this.setData({ isFirst: false })
                    //设置语言,判断是否切换语言
                    app.loadLangNewFn(this, 'serve');
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
        isFirst: true,

        langData: null,  //语言数据
    },

    /**-------- 组件加载完成后 ---------**/
    attached() {
        
    },

    /**-------- 组件的方法列表 ---------**/
    methods: {

        //获取列表数据
        getListInfo(isReach) {
            var _this = this;
            var langData = _this.data.langData;
            listFn.listPage({
                url: `/serviceInfo/list`,
                data:{
                    orderType: _this.properties.orderType, //排序类型（1-发布时间 2-咨询量 3-销售量 4-价格）
                    isAsc: _this.properties.isAsc,   //排序方向（1-升序 2-降序，默认2）
                    categoryId: _this.properties.categoryId,  //分类ID
                    supplierId: _this.properties.supplierId,  //服务商ID
                },
                isReach: isReach,
                page: _this,
                listDataName: 'listInfo',
                getListDataFn: (listdata) => {
                    //返回列表数据和总数
                    return {
                        list: listdata.data,
                        total: listdata.total
                    }
                },
                success: () => {
                    console.log("服务列表接口", _this.data.listInfo);
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
                url: `pages/services/serve-detail/serve-detail?id=${id}`,
            });
        },

        //图片加载失败显示默认图
        errorImgFn(e) {
            //有三个参数：当前页面this，要替换的对象，替换图片地址
            commonFn.errorImg(this, e.currentTarget.dataset.obj);
        }
    }
})


