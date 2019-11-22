const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数
var WxParse = require('../../../wxParse/wxParse.js');

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        navWidth: 0, //滚动日期的长度
        dateList: [],  //顶部日期列表
        dateIndex: 1, //顶部默认指定第几天，0表示今天

        listInfo: {},   //场地列表
        orderList: null, //场地订单列表

        startDate:'',   //当前开始日期
        endDate:'',      //当前结束日期

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'reserve', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.reserveTitle[lang] });  //设置当前页面的title
        });

        //获取设定的日期数组
        var dateList = this.dateFn(15);
        var dateIndex = this.data.dateIndex;
        //设定滚动日期菜单
        this.setData({
            dateList: dateList,
            startDate: dateList[dateIndex].date_start,
            endDate: dateList[dateIndex].date_end,
            navWidth: dateList.length * 110
        });
        console.log('日期数据：', this.data.dateList);
        this.getOrderList('', (res) => {
            this.getVenueList(true);
        });

    },

    //设置顶部日期
    dateFn(dayTimes) {
        var langData = this.data.langData;
        var lang = this.data.lang
        const add0 = m => { return m < 10 ? '0' + m : m };
        var weekTxt = langData.dayNames;
        var nowTime = new Date();
        var year = nowTime.getFullYear();
        var month = nowTime.getMonth() + 1;
        var day = nowTime.getDate();
        var week = nowTime.getDay();
        var dayDate = new Date(year, month, 0);
        var days = dayDate.getDate(); //当前月份天数
        var nowDateList = [];
        for (var i = 0; i < dayTimes; i++) {
            var dayTxt = day + i;
            var dayTxt2 = day + i + 1;
            var month1 = month;
            var month2 = month;
            var weekTxt2 = weekTxt[(nowTime.getDay() + i) % 7][lang];
            if (i == 0) { weekTxt2 = langData.today[lang] };
            if (i == 1) { weekTxt2 = langData.tomorrow[lang] };
            if (dayTxt > days) {
                month1 = month1 + 1;
                dayTxt = dayTxt - days;
            }
            if (dayTxt2 > days) {
                month2 = month2 + 1;
                dayTxt2 = dayTxt2 - days;
            }
            console.log(days, month2);
            var date = year + '-' + add0(month1) + '-' + add0(dayTxt);
            var date2 = year + '-' + add0(month2) + '-' + add0(dayTxt2);

            var arrItem = { date_start: date, date_end: date2, day: dayTxt, week: weekTxt2 };
            nowDateList.push(arrItem);
        }
        return nowDateList;
    },

    //切换日期
    changeDateFn(e) {
        var index = e.currentTarget.dataset.index;  //获取开始日期
        var nowDateItem = this.data.dateList[index];
        this.setData({
            ['listInfo.pageNum']:1,
            dateIndex: index,
            startDate: nowDateItem.date_start,   //当前开始日期
            endDate: nowDateItem.date_end      //当前结束日期
        });
        //重新获取场地列表
        this.getOrderList('', (res) => {
            this.getVenueList(true);
        });
    },

    //获取场地预定列表
    getVenueList(isReach) {
        var _this = this;
        var orderList = this.data.orderList;
        listFn.listPage({
            url: '/chamber/list',
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
            disposeFn: (listItem, index, total) => {
                console.log()
                //对列表循环操作改变数据
                var listItem = listItem;
                if (listItem) {
                    listItem.serviceTagList = listItem.serviceTags ? listItem.serviceTags.split(',') : null;  //标签
                    var hours = [];
                    for (var i = 1; i < 25; i++) {
                        var statusCode = 1; //自定义小时的状态（0：不能预定，1：可以预定，2：被预定）
                        if (i < listItem.availableStart || i > listItem.availableEnd) {
                            statusCode = 0;
                        } else {
                            //循环订单信息查找当前“小时”是否被预定
                            orderList.forEach((orderItem) => {
                                if (listItem.chamberId == orderItem.chamberId) {
                                    if (i >= parseInt(orderItem.orderStart.substring(11, 13)) && i <= parseInt(orderItem.orderEnd.substring(11, 13))) {
                                        statusCode = 2;
                                    }
                                }
                            });
                        }
                        hours.push({ num: i, status: statusCode });
                    }
                    listItem.hourList = hours;  //预定时间
                    //富文本转换
                    //item.description = commonFn.replaceTxt(item.description);  //替换<o:p>等标签
                    //desListData.push(listItem.description);  //循环保存内容名称
                    WxParse.wxParse('content' + index, 'html', listItem.description, this);
                    if (index === total - 1) {
                        WxParse.wxParseTemArray("desList", 'content', total, this);
                    }
                }
                return listItem;
            },
            success: () => {
                console.log("场地预定接口", _this.data.listInfo);
            }

        });
    },

    //获取场地预定订单列表
    getOrderList(chamberId, callback) {
        var _this = this;
        app.requestFn({
            url: `/chamber/orderList`,
            isLoading:false,
            data: {
                chamberId: chamberId, //场地预定id，空则所有
                start: _this.data.startDate,  //开始日期 yyyy-MM-dd
                end: _this.data.endDate     //结束日期 yyyy-MM-dd
            },
            success: (res) => {
                console.log("预定订单列表：", res.data.data);
                var list = res.data.data;
                _this.setData({orderList:list });
                callback && callback(list);
            }
        });
    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        console.log('图片加载失败', e.currentTarget.dataset.obj)
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    }



})