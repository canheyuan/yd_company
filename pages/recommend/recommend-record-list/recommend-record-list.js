
const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
const listFn = require('../../../utils/list.js'); //通用列表函数

Page({

  data: {
    domainUrl: app.globalData.domainUrl,
    nowTime:null,
    dateTag:null,
    dateTagIndex:0,
    visNum:0, //浏览人数

    listInfo: {},  //活动列表

    rankTxt: '', //排序字段，默认时间：last_time，访问次数：visit_count
    rankDirection:'', //排序方向，
    rankIndex:0,  

      langData: null,  //语言数据
      lang: '',    //语言类型
  },

  onLoad: function (options) {

      //设置语言,判断是否切换语言
      app.loadLangNewFn(this, 'recommend', (res, lang) => {
          wx.setNavigationBarTitle({ title: res.recordTitle[lang] });  //设置当前页面的title

          //时间设定
          var nowDate = new Date();
          var timestamp = nowDate.getTime();
          var nowTime = commonFn.getDate(timestamp);
          var day = commonFn.getDate(timestamp).substring(0, 10) + ' 00:00:00';
          var month = commonFn.getDate(timestamp).substring(0, 7) + '-01 00:00:00';

          var dateTag = [
              { title: res.public.today[lang], date: day },
              { title: res.public.month[lang], date: month },
              { title: res.public.all[lang], date: '' },
          ];
          this.setData({
              nowTime: nowTime,
              dateTag: dateTag,
              visNum: options.num ? options.num : 0
          });

      });

    this.getListInfo(true);
  },

  //切换时间筛选
  dateTagFn(e){
    var index = e.currentTarget.dataset.index;
    this.setData({ 
      dateTagIndex : index ,
      pageIndex:1
    });
    this.getListInfo(true);
  },

    //获取列表数据
    getListInfo(isReach) {
        var _this = this;
        listFn.listPage({
            url: `/houseDistribution/visitorList`,
            isReach: isReach,
            data: {
                orderByColumn: _this.data.rankTxt,        //排序字段  
                isAsc: _this.data.rankDirection,           //排序方向
                beginTimeStr: _this.data.dateTag[_this.data.dateTagIndex].date,   //开始时间：2018-08-08 08:00:00
                endTimeStr: _this.data.nowTime,     //结束时间
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
            success: () => {
                console.log("公告列表接口：", _this.data.listInfo);
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


    //排序
    rankFn(e) {
        var rankTxt = e.currentTarget.dataset.rank;
        var rankDirection = '';
        var rankIndex = e.currentTarget.dataset.index;
        if (rankTxt == this.data.rankTxt) {
            rankDirection = (this.data.rankDirection == '' ? 'desc' : '');
        } else {
            rankDirection = '';
        }
        this.setData({
            pageIndex: 0,
            rankTxt: rankTxt,
            rankDirection: rankDirection,
            rankIndex: rankIndex
        });
        this.getListInfo(true);
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})