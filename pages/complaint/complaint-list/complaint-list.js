const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js');
const listFn = require('../../../utils/list.js'); //通用列表函数

Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        listInfo: {},   //列表数据

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'complaint', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });
        this.getListInfo(true);
    },

    ////获取投诉列表
    getListInfo(isReach) {
        var _this = this;

        listFn.listPage({
            url: `/estateComplaint/list`,
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
            disposeFn: (listItem) => {
                //对列表循环操作改变数据
                var listItem = listItem;
                if (listItem) {
                    listItem.applyTime = commonFn.getDate(listItem.applyTime);
                }
                return listItem;
            },
            success: () => {
                console.log("投诉建议列表接口：", _this.data.listInfo);
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

    //全屏预览图片
    previewImageFn(e) {
        var index = e.currentTarget.dataset.index;
        var imgs = e.currentTarget.dataset.imgs;
        console.log(index, ',', imgs)
        wx.previewImage({
            urls: imgs,
            current: imgs[index]
        })
    },

    //跳转到详情页
    gotoDetail(e) {
        var id = e.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({ url: `/pages/complaint/complaint-detail/complaint-detail?id=${id}` });
    },

})