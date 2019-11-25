
const app = getApp();  //获取应用实例
var commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        listInfo: {},   //列表数据

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad() {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'message', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.listTitle[lang] });  //设置当前页面的title
        });
        this.getListInfo(true);  //加载完页面加载记录列表
    },

    //获取列表数据
    getListInfo(isReach) {
        var _this = this;
        listFn.listPage({
            url: `/message/list`,
            isReach: isReach,
            page: _this,
            listDataName: 'listInfo',
            getListDataFn: (listdata) => {
                //返回列表数据和总数
                return {
                    list: listdata.data,
                    total: listdata.total
                }
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

    //跳转到对应详情页
    gotoFn(e) {
        var item = e.currentTarget.dataset.item;
        var obj = e.currentTarget.dataset.obj;
        var gotoUrl = '';
        if (item.targetType == 'my_goods') { //物资
            gotoUrl = "/pages/supplies/borrowed-record/borrowed-record"
        } else if (item.targetType == 'my_reservation') { //场地预定
            gotoUrl = "/pages/user/my-reserve-details/my-reserve-details?id=" + item.targetAddress
        } else if (item.targetType == 'my_repair') { //报修
            gotoUrl = "/pages/repair/repair-detail/repair-detail?id=" + item.targetAddress
        } else if (item.targetType == 'my_activity') { //活动
            gotoUrl = "/activity/activity-details/activity-details?id=" + item.targetAddress
        }

        //设置已读
        app.requestFn({
            isLoading: false,
            url: `/message/read/${item.msgId}`,
            method: "POST",
            success: (res) => {
                this.setData({ [obj]: 'Y' });
                if (gotoUrl) {
                    wx.navigateTo({ url: gotoUrl });
                }
            }
        });

    }
})