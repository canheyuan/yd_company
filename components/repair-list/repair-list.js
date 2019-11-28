
const app = getApp(); //获取应用实例
const listFn = require('../../utils/list.js'); //通用列表函数

Component({
    //组件的属性列表
    properties: {

        targetPage: String,

        repairType: {
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({ repairType: newVal });
                //this.getListInfo(1, newVal);    //改变列表数据
            }
        },

        reachData: {
            type: Number, //类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            observer: function (newVal, oldVal, changedPath) {
                if (this.data.isFirst) {
                    this.setData({ isFirst: false })
                    app.loadLangNewFn(this, 'cpRepairList');
                }
                //随机数大于1：刷新。小于1：上拉刷新
                if (newVal > 1) {
                    this.setData({ ['listInfo.pageNum']: 1 });
                };
                this.loadMoreListFn();
            }
        }
    },

    //组件的初始数据
    data: {
        repairType: '',  //接口数据类型
        listInfo: {},   //列表数据

        tipType: '', //提示弹窗类型remove、finish、star
        tipPopShow: true,  //是否隐藏提示弹窗
        repairIndex: null,  //操作数据的索引
        starScore: 0,  //评分分数

        isFirst:true,
        langData: null,  //语言数据
    },

    //组件的方法列表
    methods: {
        //跳转到详情页
        gotoDetailsFn(e) {
            var rId = e.currentTarget.dataset.repair_id;
            wx.navigateTo({
                url: '/pages/repair/repair-detail/repair-detail?id=' + rId,
            })
        },

        //获取列表数据
        getListInfo(isReach) {
            var _this = this;

            listFn.listPage({
                url: '/estateRepair/myRepair',
                data: {
                    type: _this.data.repairType  //类型，0所有 1待处理 2跟进中 3已完成，默认0
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
                        switch (listItem.status) {
                            case 1:
                                listItem.statusClass = 'l_yellow';
                                break;
                            case 2:
                                listItem.statusClass = 'l_blue';
                                break;
                            case 3:
                                listItem.statusClass = 'l_blue2';
                                break;
                            case 4:
                                listItem.statusClass = 'l_gray';
                                break;
                        }
                    }
                    return listItem;
                },
                success: () => {
                    console.log("报修列表接口：", _this.data.listInfo);
                }

            });
        },

        //上拉到底部加载更多函数
        loadMoreListFn: function () {
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
        popShowFn(e) {
            var rIndex = e.currentTarget.dataset.index;
            var rType = e.currentTarget.dataset.type;
            this.setData({
                tipType: rType,
                repairIndex: rIndex,
                tipPopShow: false
            });
        },

        //关闭弹窗
        closeTipPop(e) {
            this.setData({
                tipType: '',
                tipPopShow: true
            });
        },

        //删除报修
        removeRepairFn(e) {
            var _this = this;
            var langData = this.data.langData
            var lang = this.data.lang

            var formId = e.detail.formId;
            var repairId = _this.data.listInfo.list[_this.data.repairIndex].repairId;
            app.getFormIdFn(formId, () => {
                app.requestFn({
                    loadTitle: langData.public.deleteTip[lang],
                    url: `/estateRepair/cancel`,
                    header: 'application/x-www-form-urlencoded',
                    data: {
                        repairId: repairId  //报修id
                    },
                    method: 'POST',
                    success: (res) => {
                        console.log(_this.data.repairIndex);
                        var list = _this.data.listInfo.list
                        list.splice(_this.data.repairIndex, 1); //手动删除该条数据，避免重新加载接口
                        _this.setData({ ['listInfo.list']: list });
                        _this.closeTipPop();  //关闭弹窗
                        wx.showToast({ title: langData.callOffRepair[lang], icon: 'success', duration: 2000 });
                    }
                });
            })
            
        },

        //评分
        starChangeFn(e) {
            var star = e.currentTarget.dataset.star;
            this.setData({ starScore: star });
        },
        
        //提交评分
        starRepairFn(e) {
            var _this = this;
            var langData = this.data.langData
            var lang = this.data.lang

            var formId = e.detail.formId;
            var repairId = _this.data.listInfo.list[_this.data.repairIndex].repairId;
            var starScore = _this.data.starScore;
            app.getFormIdFn(formId, () => {
                app.requestFn({
                    loadTitle: langData.public.submit[lang],
                    url: `/estateRepair/star`,
                    header: 'application/x-www-form-urlencoded',
                    data: {
                        repairId: repairId,  //报修id
                        star: starScore,  //分数
                        comment: ''          //评论（暂时没有）
                    },
                    method: 'POST',
                    success: (res) => {
                        //_this.setData({ ['listInfo.list']: null }); //先清空评论列表，
                        this.setData({ ['listInfo.pageNum']: 1 });
                        _this.getListInfo(true); //更新组件列表信息
                        _this.closeTipPop();
                        wx.showToast({ title: langData.public.scoredTip[lang], icon: 'success', duration: 2000 });
                    }
                });
            });
        }
    }
})

