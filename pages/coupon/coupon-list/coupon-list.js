const app = getApp();
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数
Page({

    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        listInfo: {},   //列表数据
        coupopPopIsShow: false,  //优惠券弹窗是否显示
        isIndexBtnShow :false,   //返回首页按钮是否显示

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        if (options.from == 'mp') {
            this.setData({ isIndexBtnShow: true });
        }

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'coupon', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.listTitle[lang] });  //设置当前页面的title
        });

        this.getListInfo(true);
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    //获取列表数据
    getListInfo(isReach) {
        var _this = this;
        var langData = this.data.langData
        var lang = this.data.lang
        listFn.listPage({
            url: `/coupon/list`,
            data:{
                statusStr: '1,2'   //状态（1-待开放 2-领取中 3-已领完 4-已过期），例：1,2,3；不传查全部
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
                    //循环数组转换时间戳 
                    listItem.useStart = listItem.useStart ? listItem.useStart.slice(5, 16) : '';
                    listItem.useEnd = listItem.useEnd ? listItem.useEnd.slice(5, 16) : '';
                    listItem.jdNum = parseInt(100 * listItem.receivedCount / listItem.totalCount);

                    if (listItem.couponType == 1) {
                        var discountArr = listItem.discountText.split(',');
                        listItem.discountPrice = discountArr[1] + langData.public.yuanText[lang];
                        listItem.discountSumPrice = discountArr[0] > 0 ? `${langData.manText[lang]}${discountArr[0]}${langData.text1[lang]}` : langData.text3[lang];
                    } else if (listItem.couponType == 2) {
                        var discountArr = listItem.discountText.split(',');
                        if(_this.data.langType=='en'){
                            listItem.discountPrice = parseInt(10 - discountArr[1]) * 10 + langData.public.zheText[lang];
                        }else{
                            listItem.discountPrice = discountArr[1] + langData.public.zheText[lang];
                        }
                        
                        listItem.discountSumPrice = discountArr[0] > 0 ? `${langData.manText[lang]}${discountArr[0]}${langData.text2[lang]}` : langData.text3[lang];
                    }

                    if (listItem.useTimeType == 1) {
                        listItem.useTimeText = `${langData.validTime[lang]}：${listItem.useStart} ${langData.public.toText[lang]} ${listItem.useEnd}`;
                    } else {
                        listItem.useTimeText = `${langData.validTime[lang]}：${langData.text5[lang]}${listItem.usableDay}${langData.text6[lang]}`;
                    }


                    switch (listItem.status) {
                        case 1:
                            listItem.statusClass = '';
                            listItem.statusName = langData.status1[lang];
                            listItem.getTimeTxt = langData.startTime[lang] + listItem.receiveStart.slice(0, 16) + langData.text7[lang];
                            break;
                        case 2:
                            listItem.statusClass = 'start';
                            listItem.statusName = langData.status2[lang]
                            listItem.getTimeTxt = langData.endTime[lang] + listItem.receiveEnd.slice(0, 16)
                            break;
                        case 3:
                            listItem.statusClass = 'end';
                            listItem.statusName = langData.status3[lang]
                            listItem.getTimeTxt = langData.endTime[lang] + listItem.receiveEnd.slice(0, 16)
                            break;
                        case 4:
                            listItem.statusClass = 'end';
                            listItem.statusName = langData.status4[lang]
                            listItem.getTimeTxt = langData.pastDue[lang]
                            break;
                    }
                }
                return listItem;
            },
            success: () => {
                //console.log("优惠券接口：", _this.data.listInfo);
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

    //下拉刷新
    onPullDownRefresh: function () {
        this.setData({ ['listInfo.pageNum'] :1 })
        this.getListInfo(true);
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //获取验证码
    getCouponFn(e) {
        var _this = this;
        var couponId = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        app.requestFn({
            loadTitle: '领取中',
            url: `/coupon/receive`,
            data: {
                'couponId': couponId
            },
            header: 'application/x-www-form-urlencoded',
            method: 'POST',
            success: (res) => {
                var listItem = _this.data.listInfo.list[index];
                listItem.receivedCount++;
                listItem.jdNum = parseInt(100 * listItem.receivedCount / listItem.totalCount);
                _this.setData({
                    ['listInfo.list[' + index + ']']: listItem,
                    coupopPopIsShow: true 
                });
            }
        });
    },

    //关闭弹窗
    closeCoupopPop() {
        this.setData({ coupopPopIsShow: false })
    },

    //转发
    onShareAppMessage: function () { },
})