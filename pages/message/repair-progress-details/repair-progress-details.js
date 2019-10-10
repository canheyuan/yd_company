const app = getApp(); //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        detailsData: null, //详情数据
        detailsImgs: [], //详情图片地址数组
        progressDetails: true, //详细进度是否隐藏
        popIsShow: true, //服务价格一览表弹窗是否显示
        infoShow: false, //报修更多内容是否隐藏
        tipType: '', //提示弹窗类型remove、star

        tipPopDeleteShow: true,  //是否隐藏提示弹窗
        tipPopStarShow: true, //服务评分弹窗是否隐藏

        starScore: 0,  //评分分数

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'repair', (res) => {
            wx.setNavigationBarTitle({ title: res.repairDetailTitle });  //设置当前页面的title
        });
        this.getRepairDetail(options.id);
    },

    //获取报修详情
    getRepairDetail(repairId) {
        app.requestFn({
            url: `/estateRepair/detail/${repairId}`,
            success: (res) => {
                var detailData = res.data.data;
                switch (detailData.status) {
                    case 1:
                        detailData.statusClass = 'l_yellow';
                        break;
                    case 2:
                        detailData.statusClass = 'l_blue';
                        break;
                    case 3:
                        detailData.statusClass = 'l_blue2';
                        break;
                    case 4:
                        detailData.statusClass = 'l_gray';
                        break;
                }
                //detailData.imgList = detailData.images ? detailData.images.split(',') : [];

                this.setData({
                    detailsData: detailData,
                    detailsImgs: detailData.imageList
                })
                console.log("报修详情:", detailData);
            }
        });
    },

    //删除报修
    removeRepairFn(e) {
        var _this = this;
        var repairId = _this.data.detailsData.repairId;
        app.requestFn({
            isLoading: false,
            url: `/estateRepair/cancel`,
            header: 'application/x-www-form-urlencoded',
            data: {
                repairId: repairId  //报修id
            },
            method: 'POST',
            success: (res) => {
                app.globalData.myRepairReach = true;
                wx.navigateBack();
            }
        });
    },

    //评分星星
    starChangeFn(e) {
        var star = e.currentTarget.dataset.star;
        this.setData({
            starScore: star
        });
    },

    //提交评分
    starRepairFn(e) {
        var _this = this;
        var repairId = _this.data.detailsData.repairId;
        var starScore = _this.data.starScore;
        app.requestFn({
            isLoading:false,
            url: `/estateRepair/star`,
            header: 'application/x-www-form-urlencoded',
            data: {
                repairId: repairId,  //报修id
                star: starScore,  //分数
                comment: ''       //评论（暂时没有）
            },
            method: 'POST',
            success: (res) => {
                app.globalData.myRepairReach = true;
                _this.getRepairDetail(repairId)
                _this.closeTipPop();
            }
        });
    },

    //打开弹窗
    popShowFn(e) {
        var rType = e.currentTarget.dataset.type; //弹窗类型remove、star
        if (rType == 'remove') {
            this.setData({ tipPopDeleteShow: false });
        } else if (rType == 'star') {
            this.setData({ tipPopStarShow: false });
        }
    },

    //关闭弹窗
    closeTipPop(e) {
        this.setData({
            tipPopStarShow: true,
            tipPopDeleteShow: true
        });
    },

    //显示隐藏进度详情
    progressDetailsFn(e) {
        this.setData({
            progressDetails: !this.data.progressDetails
        });
    },

    //展开收缩报修内容
    infoShowFn() {
        this.setData({
            infoShow: !this.data.infoShow
        });
    },

    //打开关闭服务价格一览表弹窗
    popFn() {
        this.setData({
            popIsShow: !this.data.popIsShow
        })
    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj);
    }
})