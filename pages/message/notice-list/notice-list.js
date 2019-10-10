const app = getApp();  //获取应用实例
var commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数

Page({
    data: {
        domainUrl: app.globalData.domainUrl,

        listInfo: {},   //列表数据
        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'message', (res) => {
            wx.setNavigationBarTitle({ title: res.noticeTitle });  //设置当前页面的title
        });

        this.getListInfo(true);  //加载完页面加载记录列表
    },

    //获取列表数据
    getListInfo(isReach) {
        var langData = this.data.langData;
        var _this = this;
        listFn.listPage({
            url: `/noticeInfo/list`,
            isReach: isReach,
            page: _this,
            listDataName: 'listInfo',
            getListDataFn: (listdata) => {
                //返回列表数据和总数
                return {
                    list: listdata.data.rows,
                    total: listdata.data.total
                }
            },
            success:()=>{
                console.log('listInfo.list',_this.data.listInfo)
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
        });
    },

    //跳转到详情
    gotoDetailFn(e){
        var item = e.currentTarget.dataset.item;
        var index = e.currentTarget.dataset.index;
        item.isUnread = 'N';
        this.setData({
            ['listInfo.list[' + index +']'] : item
        })
        wx.navigateTo({
            url: `/pages/message/notice-details/notice-details?id=${item.noticeId}`,
        })
    }

})