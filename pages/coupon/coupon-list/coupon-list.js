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
        app.loadLangFn(this, 'coupon', (res) => {
            wx.setNavigationBarTitle({ title: res.listTitle });  //设置当前页面的title
        });

        this.getListInfo(true);
    },

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    //获取列表数据
    getListInfo(isReach) {
        var _this = this;
        var langData = this.data.langData;
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
                        listItem.discountPrice = discountArr[1] + langData.public.yuanText;
                        listItem.discountSumPrice = discountArr[0] > 0 ? `${langData.manText}${discountArr[0]}${langData.text1}` : langData.text3;
                    } else if (listItem.couponType == 2) {
                        var discountArr = listItem.discountText.split(',');
                        if(_this.data.langType=='en'){
                            listItem.discountPrice = parseInt(10 - discountArr[1])*10 + langData.public.zheText;
                        }else{
                            listItem.discountPrice = discountArr[1] + langData.public.zheText;
                        }
                        
                        listItem.discountSumPrice = discountArr[0] > 0 ? `${langData.manText}${discountArr[0]}${langData.text2}` : langData.text3;
                    }

                    if (listItem.useTimeType == 1) {
                        listItem.useTimeText = `${langData.validTime}：${listItem.useStart} ${langData.public.toText} ${listItem.useEnd}`;
                    } else {
                        listItem.useTimeText = `${langData.validTime}：${langData.text5}${listItem.usableDay}${langData.text6}`;
                    }


                    switch (listItem.status) {
                        case 1:
                            listItem.statusClass = '';
                            listItem.statusName = langData.status1;
                            listItem.getTimeTxt = langData.startTime + listItem.receiveStart.slice(5, 16) + langData.text7;
                            break;
                        case 2:
                            listItem.statusClass = 'start';
                            listItem.statusName = langData.status2;
                            listItem.getTimeTxt = langData.endTime + listItem.receiveEnd.slice(5, 16);
                            break;
                        case 3:
                            listItem.statusClass = 'end';
                            listItem.statusName = langData.status3;
                            listItem.getTimeTxt = langData.endTime + listItem.receiveEnd.slice(5, 16);
                            break;
                        case 4:
                            listItem.statusClass = 'end';
                            listItem.statusName = langData.status4;
                            listItem.getTimeTxt = langData.pastDue;
                            break;
                    }
                }
                return listItem;
            },
            success: () => {
                console.log("优惠券接口：", _this.data.listInfo);
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
        this.setData({
            coupopPopIsShow: false
        })
    },
})