
const app = getApp(); //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数
Page({
  data: {
    domainUrl: app.globalData.domainUrl,
      isIndexBtnShow: false,  //是否显示返回首页按钮
      listInfo: {
          pageSize: 20
      }, //记录列表

      langData: null,  //语言数据
      langType: '',    //语言类型
  },

  onLoad: function (options) {
    console.log('页面传递过来的参数：',options);
    if (options.from == 'ma_msg') {
      this.setData({ isIndexBtnShow: true });
    }
    //设置语言,判断是否切换语言
    app.loadLangFn(this, 'supplies', (res) => {
        wx.setNavigationBarTitle({ title: res.borrowedRecordTitle });  //设置当前页面的title
    });
    this.getListInfo(true);  //加载完页面加载记录列表
  },
  
    //获取列表数据
    getListInfo(isReach) {
        var _this = this;

        listFn.listPage({
            url: `/estateRentDetail/list`,
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

                    listItem.dateTime = commonFn.getDate(listItem.applyTime); //循环数组转换时间戳

                }
                return listItem;
            },
            success: () => {
                console.log("借用记录列表接口：", _this.data.listInfo);
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
})