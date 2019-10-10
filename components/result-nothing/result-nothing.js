
const app = getApp()    //获取应用实例
var nothingData = require('nothing-data.js');   //页面内容数据
Component({
    properties: {
        cName: String
    },
    data: {
        domainUrl: app.globalData.domainUrl,
        pageData: {
            icon: '/images/icon/result_nothing.png',
            title: '暂无内容哦！',
            btm_btn: '返回首页',  //底部按钮文字跳转类型
            btm_btn_url: '/pages/index/index',  //底部按钮链接
            btm_btn_type: 'switchTab'  //底部按钮跳转类型
        }

    },
    //组件加载完成后
    attached() {
        let c_name = this.properties.cName;
        var pageInfo = nothingData.page_data();
        var datas = pageInfo[c_name];
        if (datas) {
            this.setData({ pageData: datas });
        }
        this.triggerEvent('getTitle', this.data.pageData.page_title);
    }
})
