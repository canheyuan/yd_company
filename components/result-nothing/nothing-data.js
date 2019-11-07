
function pageDataFn() {
    var app = getApp();  //获取应用实例
    var langData = app.globalData.langData[app.globalData.langType].nothingData;
    var page_data = {
        //活动列表暂无状态
        activity: {
            icon: '/images/icon/result_nothing.png', //图标
            title: langData.activity,    //标题
            des: '',  //描述
            details_btn: '',  //描述下面按钮
            details_btn_url: '',  //描述下面按钮链接
            details_btn_type: '', //描述下面按钮
            // btm_btn: '返回首页',  //底部按钮文字跳转类型
            // btm_btn_url: '/pages/index/index',  //底部按钮链接
            // btm_btn_type: 'switchTab'  //底部按钮跳转类型
        },
        //活动列表暂无状态
        activity_collect: {
            icon: '/images/icon/result_nothing.png',
            title: langData.activity_collect,
            des: '',
        },
        //活动列表暂无状态
        news: {
            icon: '/images/icon/result_nothing.png',
            title: langData.news,
            des: '',
        },
        news_collect: {
            icon: '/images/icon/result_nothing.png',
            title: langData.news_collect,
            des: '',
        },
        discuss: {
            icon: '',
            title: langData.discuss,
            des: '',
        },
        policy: {
            icon: '/images/icon/result_nothing.png',
            title: langData.policy,
            des: '',
        },
        policy_collect: {
            icon: '/images/icon/result_nothing.png',
            title: langData.policy_collect,
            des: '',
        },
        supplies: {
            icon: '/images/icon/result_nothing.png',
            title: langData.supplies,
            des: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        order: {
            icon: '/images/order/zdcx_img.png',
            title: langData.order,
            des: ''
        },
        repair: {
            icon: '/images/icon/result_nothing.png',
            title: langData.repair,
            des: ''
        },
        reserve: {
            icon: '/images/icon/result_nothing.png',
            title: langData.reserve,
            des: ''
        },
        expert: {
            icon: '/images/icon/result_nothing.png',
            title: langData.expert,
            des: ''
        },
        expert2: {
            icon: '/images/icon/result_nothing.png',
            title: langData.expert2,
            des: ''
        },
        message: {
            icon: '/images/icon/result_nothing.png',
            title: langData.message,
            des: ''
        },
        visitor: {
            icon: '/images/icon/result_nothing.png',
            title: langData.visitor,
            des: ''
        },
        complaint: {
            icon: '/images/icon/result_nothing.png',
            title: langData.complaint,
            des: ''
        },
        myRecommend: {
            icon: '/images/icon/result_nothing.png',
            title: langData.myRecommend,
            des: ''
        },
        coupon_list: {
            icon: '/images/icon/result_nothing.png',
            title: langData.coupon_list,
            des: ''
        },
        companyHosekeeper: {
            icon: '/images/icon/result_nothing.png',
            title: langData.companyHosekeeper,
            des: ''
        },
        companySearchList:{
            icon: '/images/icon/result_nothing.png',
            title: langData.companySearchList,
            des: ''
        },
        serve:{
            icon: '/images/icon/result_nothing.png',
            title: '暂无服务',
            des: ''
        }
    }
    return page_data;
}
module.exports = {
    page_data: pageDataFn
}
