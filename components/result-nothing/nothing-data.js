
function pageDataFn() {
    var app = getApp();  //获取应用实例
    var lang = app.globalData.lang
    var langData = app.globalData.langNewData.nothingData;
    var page_data = {
        //活动列表暂无状态
        activity: {
            icon: '/images/icon/result_nothing.png', //图标
            title: langData.activity[lang],    //标题
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
            title: langData.activity_collect[lang],
            des: '',
        },
        //活动列表暂无状态
        news: {
            icon: '/images/icon/result_nothing.png',
            title: langData.news[lang],
            des: '',
        },
        news_collect: {
            icon: '/images/icon/result_nothing.png',
            title: langData.news_collect[lang],
            des: '',
        },
        discuss: {
            icon: '',
            title: langData.discuss[lang],
            des: '',
        },
        policy: {
            icon: '/images/icon/result_nothing.png',
            title: langData.policy[lang],
            des: '',
        },
        policy_collect: {
            icon: '/images/icon/result_nothing.png',
            title: langData.policy_collect[lang],
            des: '',
        },
        supplies: {
            icon: '/images/icon/result_nothing.png',
            title: langData.supplies[lang],
            des: '',
            btm_btn: langData.backIndexBtn[lang],
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        order: {
            icon: '/images/order/zdcx_img.png',
            title: langData.order[lang],
            des: ''
        },
        repair: {
            icon: '/images/icon/result_nothing.png',
            title: langData.repair[lang],
            des: ''
        },
        reserve: {
            icon: '/images/icon/result_nothing.png',
            title: langData.reserve[lang],
            des: ''
        },
        expert: {
            icon: '/images/icon/result_nothing.png',
            title: langData.expert[lang],
            des: ''
        },
        expert2: {
            icon: '/images/icon/result_nothing.png',
            title: langData.expert2[lang],
            des: ''
        },
        message: {
            icon: '/images/icon/result_nothing.png',
            title: langData.message[lang],
            des: ''
        },
        visitor: {
            icon: '/images/icon/result_nothing.png',
            title: langData.visitor[lang],
            des: ''
        },
        complaint: {
            icon: '/images/icon/result_nothing.png',
            title: langData.complaint[lang],
            des: ''
        },
        myRecommend: {
            icon: '/images/icon/result_nothing.png',
            title: langData.myRecommend[lang],
            des: ''
        },
        coupon_list: {
            icon: '/images/icon/result_nothing.png',
            title: langData.coupon_list[lang],
            des: ''
        },
        companyHosekeeper: {
            icon: '/images/icon/result_nothing.png',
            title: langData.companyHosekeeper[lang],
            des: ''
        },
        companySearchList:{
            icon: '/images/icon/result_nothing.png',
            title: langData.companySearchList[lang],
            des: ''
        },
        serve:{
            icon: '/images/icon/result_nothing.png',
            title: langData.serve[lang],
            des: ''
        },
        house:{
            icon: '/images/icon/result_nothing.png',
            title: '暂无户型',
            des: ''
            
        }
    }
    return page_data;
}
module.exports = {
    page_data: pageDataFn
}
