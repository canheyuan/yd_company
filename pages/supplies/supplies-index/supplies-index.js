
const app = getApp();  //获取应用实例
const listFn = require('../../../utils/list.js'); //通用列表函数
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        pageNum: 1,    //列表接口页码

        wzPopShow: false,  //借用物资确认弹窗
        popGoodItem: '', //弹窗里的借用物品信息
        //popGoodId: '', //弹窗里的借用物品id

        listInfo: {
            pageSize: 20
        }, //记录列表

        langData: null,  //语言数据
        lang: '',    //语言类型
    },

    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'supplies', (res, lang) => {
            wx.setNavigationBarTitle({ title: res.borrowTitle[lang] });  //设置当前页面的title
        });

        this.getListInfo(true);  //获取物资列表数据
    },

    //获取列表数据
    getListInfo(isReach) {
        var _this = this;

        listFn.listPage({
            url: `/estateSharedGoods/list`,
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
            success: () => {
                console.log("物资共享接口：", _this.data.listInfo);
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

    //打开弹窗
    applyFn(e) {
        this.setData({
            wzPopShow: true,
            popGoodItem: e.currentTarget.dataset.item
        })
    },

    //关闭弹窗
    closePop() {
        this.setData({ wzPopShow: false  })
    },

    //弹窗跳转到成功页
    gotoSuccessFn(e) {
        var foodList = this.data.listInfo.list
        var goodsId = this.data.popGoodItem.goodsId
        var formId = e.detail.formId;
        app.getFormIdFn(formId,()=>{
            //提交物资共享
            app.requestFn({
                url: `/estateRentDetail`,
                data: {
                    goodsId: goodsId, //物品id
                    rentCount: 1, //数量
                    remark: ''  //备注
                },
                method: 'POST',
                success: (res) => {
                    //借用后列表里数量减1
                    foodList.forEach(item=>{
                        if (item.goodsId == goodsId){
                            item.restCount = item.restCount - 1
                        }
                    })
                    this.setData({ ['listInfo.list']: foodList });
                    this.closePop()
                    wx.navigateTo({  url: '/pages/common/result/result?page=wuzi' });
                }
            });
        });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.setData({ ['listInfo.pageNum'] : 1 })
        this.getListInfo(true);  //获取物资列表数据
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

})