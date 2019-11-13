
const app = getApp();  //获取应用实例
const listFn = require('../../../utils/list.js'); //通用列表函数
Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        pageNum: 1,    //列表接口页码

        wzPopStatus: false,  //借用物资确认弹窗
        popGoodName: '', //弹窗里的借用物品名称
        popGoodId: '', //弹窗里的借用物品id

        listInfo: {
            pageSize: 20
        }, //记录列表

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'supplies', (res) => {
            wx.setNavigationBarTitle({ title: res.borrowTitle });  //设置当前页面的title
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
            wzPopStatus: true,
            popGoodName: e.currentTarget.dataset.name,
            popGoodId: e.currentTarget.dataset.id
        })
    },

    //关闭弹窗
    closePop() {
        this.setData({ wzPopStatus: false  })
    },

    //弹窗跳转到成功页
    gotoSuccessFn(e) {
        var goodsId = e.currentTarget.dataset.id;
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
                    this.closePop()
                    wx.navigateTo({  url: '/pages/common/result/result?page=wuzi' });
                }
            });
        });
    }

})