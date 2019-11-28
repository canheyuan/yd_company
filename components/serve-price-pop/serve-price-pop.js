
const app = getApp(); //获取应用实例
Component({
    //组件的初始数据
    data: {
        servicesList: null,
        langData: null,  //语言数据
    },

    attached() {

        //设置语言,判断是否切换语言
        app.loadLangNewFn(this, 'cpServePricePop');

        var _this = this;
        //加载完页面获取数据
        app.requestFn({
            isLoading: false,
            url: `/estateRepair/info`,
            success: (res) => {
                var datas = res.data.data;
                //console.log("服务价格一览表：", datas);
                _this.setData({ servicesList: datas.services });
            }
        });
    },
    //组件的方法列表
    methods: {
        //关闭弹窗
        closePopFn: function (e) {
            this.triggerEvent('closepop');
        }
    }
})
