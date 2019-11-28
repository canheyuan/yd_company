var configData = {
    
    nowApp: 'guangfo',    //设置当前哪个小程序的配置信息
    /*---------------------------------------------------------------------------------------------
       更新某个
       各个小程序的配置字段：
       园叮：   yuanding    wx3796a1ffecc1e11e
       小招：   xiaozhao    wx89d739bab6040e66
       广佛：   guangfo     wx7f9808aa00ac932f
    -----------------------------------------------------------------------------------------------*/



    /*---------------------------------------------------------------------------------------------
       以下是每个小程序的配置，当切换小程序时，需要2步骤
       1、开发者工具详情里把APPID换成要切换的APPID
       2、把上面的nowApp名称改为当前小程序的
    -----------------------------------------------------------------------------------------------*/
    //园叮
    yuanding: {
        jkUrl: 'https://www.5iparks.com/api',       //接口正式版
        mtjAppKey: 'cb5e07b28d',    //百度统计appKey
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
            scanCode: false,  //扫码开门
            repair: true,  //报修
            order: true,  //账单
            venue: true,  //场地预定
            orderFood: false,  //在线订餐
            zsApp: false,  //小招企服
            zgjApp: false,  //招管家
            supplies: true,  //物资共享
            activity: true,  //活动中心
            recommend: true,  //推荐有礼
            coupon: true,  //优惠券
            serve:true, //服务
            lang: false,  //语言切换
        }
    },

    //小招园叮
    xiaozhao: {
        jkUrl: 'https://demo.5iparks.com/api',       //接口正式版
        mtjAppKey: '43b1e00093',    //百度统计appKey
        appApi: {
            channel: 'cmb',  //园叮不传，小招传cmb
            aid: 'G8TDGHBTUU'   //后台获取数据的唯一标识
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
            zgjApp: false,  //招管家
            supplies: true,  //物资共享
            activity: true,  //活动中心
            recommend: true,  //推荐有礼
            coupon: true,  //优惠券
            serve: true, //服务
            lang: false,  //语言切换
        },
    },

    //广佛数字创意园园叮系统
    guangfo:{
        jkUrl: 'https://www.5iparks.com/api',       //接口正式版
        appApi: {
            channel: '',  //园叮不传，小招传cmb
            aid: 'S030T7M3VD'   //后台获取数据的唯一标识
        },

        //模块开关    
        moduleSwitch: {
            indexBook: false, //首页线上图书模块
            policy: true,  //政策模块
            complaint: true, //投诉建议模块
            visitor: true,  //访客预约
            scanCode: false,  //扫码开门
            repair: true,  //报修
            order: true,  //账单
            venue: true,  //场地预定
            orderFood: false,  //在线订餐
            zsApp: false,  //小招企服
            zgjApp: false,  //招管家
            supplies: true,  //物资共享
            activity: true,  //活动中心
            recommend: true,  //推荐有礼
            coupon: true,  //优惠券
            serve: true, //服务
            lang: false,  //语言切换
        },

        //百度统计appKey
        mtjAppKey: '081b3e64ef',
    }

}

var  appConfigData ={
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

    /*-------------- 配置信息-Start --------------*/
    jkUrl: configData[configData.nowApp].jkUrl,       //接口正式版
    mtjAppKey: configData[configData.nowApp].mtjAppKey,    //百度统计appKey
    appApi: configData[configData.nowApp].appApi,   //小程序后台配置
    moduleSwitch: configData[configData.nowApp].moduleSwitch,   //模块开关    
    /*-------------- 配置信息-End --------------*/
   
    
}

module.exports = appConfigData;