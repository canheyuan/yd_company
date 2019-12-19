const app = getApp()//  //获取应用实例
const commonFn = require('../../../utils/common.js');
const listFn = require('../../../utils/list.js'); //通用列表函数

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        lang: '',    //语言类型

        distId:'',  //分销id
        listInfo:{
            
        }
    },

    onLoad: function (options) {
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' };
        wx.setStorageSync('backUrl', backUrl);
        this.setData({ distId : options.dist_id })

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'house', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.listTitle[lang] });  //设置当前页面的title
        });

        this.getListInfo(true);
    },

    ////获取投诉列表
    getListInfo(isReach) {
        var _this = this;
        
        listFn.listPage({
            url: `/houseDistribution/unitList`,
            data: {
                distId: this.data.distId   //1-待处理 2-处理中 3-已完成
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
            disposeFn: (listItem) => {
                //对列表循环操作改变数据
                var listItem = listItem;
                if (listItem) {
                    listItem.areaResult = (listItem.biggestArea == listItem.smallestArea ? listItem.smallestArea : `${listItem.smallestArea}~${listItem.biggestArea}`)
                }
                return listItem;
            },
            success: () => {
                console.log("户型列表列表接口：", _this.data.listInfo);
            }
        });
    },


    //上拉到底部加载更多函数
    onReachBottom: function () {
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

    //用户点击右上角分享
    onShareAppMessage: function (e) {

    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

})
