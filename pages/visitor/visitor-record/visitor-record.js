
const app = getApp(); //获取应用实例
const commonFn = require('../../../utils/common.js');
const listFn = require('../../../utils/list.js'); //通用列表函数
Page({

    data: {
        domainUrl: app.globalData.domainUrl,

        listInfo: {},  //活动数据
        dateMonth: '', //筛选月份

        langData: null,  //语言数据
        lang: '',    //语言类型

    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'visitor', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.vRecordTitle[lang] });  //设置当前页面的title
        });
        this.getListInfo(true);
    },

    //切换月份
    changeMonthFn(e) {
        this.setData({ 
            dateMonth: e.detail.value, 
            ['listInfo.pageNum']:1
        });
        this.getListInfo(true);
    },

    //获取列表数据
    getListInfo(isReach) {
        var langData = this.data.langData
        var lang = this.data.lang
        var _this = this;
        listFn.listPage({
            url: `/visitorReservation/list`,
            isReach: isReach,
            data: {
                month: _this.data.dateMonth,  //筛选月份
            },
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
                    switch (listItem.status) {
                        case 1:
                            listItem.statusName = langData.statusText1[lang];
                            break;
                        case 2:
                            listItem.statusName = langData.statusText2[lang];
                            break;
                        case 3:
                            listItem.statusName = langData.statusText3[lang];
                            break;
                        default:
                            listItem.statusName = langData.statusText4[lang];
                            break;
                    }
                    listItem.reserveTime = commonFn.getDate(listItem.reserveTime).substring(0, 16);
                }
                return listItem;
            },
            success: () => {
                //console.log("预约记录接口：", _this.data.listInfo);
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
    }
})