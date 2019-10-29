
const app = getApp(); //获取应用实例
Page({
    //页面的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        recommendData: null, //推荐信息
        serveList: null,  //选项卡切换title列表
        tagIndex: 0, //选项卡切换索引

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    //选项卡切换
    tagChangeFn(e) {
        this.setData({
            tagIndex: e.currentTarget.dataset.index,
        });
    },

    onShow() {
        app.chatData.pageThis = this;

        if (app.globalData.serveReach) {
            app.globalData.serveReach = false;
            this.reachFn();
        }
    },

    reachFn() {
        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'services', (res) => {
            wx.setNavigationBarTitle({ title: res.title });  //设置当前页面的title
        });
        this.getServiceList();
    },

    //下拉刷新
    onPullDownRefresh: function () {
        this.reachFn()
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //获取服务信息
    getServiceList() {
        var _this = this;
        app.requestFn({
            url: '/enterpriseService/categoryList',
            success: (res) => {
                var serveList = res.data.data;
                serveList.forEach(item => {
                    
                    var serveSonList = [];  //把每一项的三级列表整合成一个
                    item.children.forEach(item2 => {
                        
                        if (item.iconImg) { //给三级继承一级的图标
                            item2.serviceList = item2.serviceList.map(item3 => {
                                item3.mainImg = item3.mainImg ? item3.mainImg : item.iconImg;
                                return item3;
                            });
                        }
                        serveSonList = serveSonList.concat(item2.serviceList);
                    });

                    //筛选掉没推荐的(isRecommended=Y)
                    serveSonList = serveSonList.filter(sonItem => { 
                        return sonItem.isRecommended == "Y"
                    }).map((sonItem, sonIndex) => {
                        sonItem.link = `/pages/services/services-intro/services-intro?id=${sonItem.id}`
                        sonItem.iconImg =   sonItem.mainImg ? sonItem.mainImg : 
                                            this.data.domainUrl + `/images/services/serve_ico0${sonIndex + 1}.png`
                        return sonItem;
                    });
                    item.sonList = serveSonList;
                });

                //筛选掉没推荐的(isRecommended=Y)
                // serveList.forEach(item => {
                //     item.sonList = item.sonList.filter(item2 => {
                //         return item2.isRecommended == "Y"
                //     });
                // });

                var recommendData = serveList[0];
                serveList.shift();
                this.setData({
                    recommendData: recommendData,
                    serveList: serveList
                });
                console.log(recommendData, serveList)
            }
        });
    }

})