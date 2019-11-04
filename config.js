module.exports = {
    //腾讯云Im的一些配置信息
    COSv5: {
        appid: '01254126397', // Bucket 所属的项目 ID
        bucket: "miniprog001-1254126397",  //空间名称 Bucket demo的IM处理封装
        region: 'ap-guangzhou', //ap-
        sid: 'AKID1whIhuqlRDrMgp8vxqcDuVv9B3EJ9RRI', // 项目的 SecretID
        skey: 'rbEkZIuNeNzUoEYq25zkw1wkWEnDRsFX' // 项目的 Secret Key
    },
    IM: {
        sdkAppID: 1400131035,
        appIDAt3rd: 1400131035, //用户所属应用id，必填
        accountType: 36152, //用户所属应用帐号类型，必填
    },

    
    jkUrl: 'https://www.5iparks.com/api',       //接口正式版
    appApi: {
        channel: '',  //园叮不传，小招传cmb
        aid: 'F9ZHVYCYS1'   //后台获取数据的唯一标识
    },

    //模块开关    
    moduleSwitch: {
        indexBook: false,  //首页线上图书模块
        policy: true,  //政策模块
        complaint: true, //投诉建议模块
        visitor: true,  //访客预约
        scanCode: true,  //扫码开门
        repair: true,  //报修
        order: true,  //账单
        venue: true,  //场地预定
        orderFood: false,  //在线订餐
        zsApp: false,  //小招企服
        zgjApp: true,  //招管家
        supplies: true,  //物资共享
        activity: true,  //活动中心
        recommend: true,  //推荐有礼
        coupon: true,  //优惠券
        lang: true,  //语言切换
    },

    mtjAppKey: 'cb5e07b28d',    //百度统计appKey
}
