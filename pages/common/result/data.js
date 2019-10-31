

function pageDataFn(){
    const app = getApp();  //获取应用实例
    var langData = app.globalData.langData[app.globalData.langType].result;
    var page_data = {
        //默认
        nothing: {
            page_title: langData.nothing.page_title,
            icon: '/images/icon/result_nothing.png',
            title: langData.nothing.title,
            des: '',
            details_btn: '',
            details_btn_url: '',
            details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },

        //注册成功
        reg: {
            page_title: langData.reg.page_title,
            icon: '/images/icon/result_reg.png',
            title: langData.reg.title,
            des: '',
            details_btn: '',
            details_btn_url: '',
            details_btn_type: '',
            btm_btn: langData.reg.btm_btn,
            btm_btn_url: '/pages/index/index',  //按钮链接地址
            btm_btn_type: 'switchTab'  //跳转类型
        },
        //找回密码成功页面
        reset_pwd: {
            page_title: langData.reset_pwd.page_title,
            icon: '/images/icon/result_reg.png',
            title: langData.reset_pwd.title,
            des: '',
            details_btn: '',
            details_btn_url: '',
            details_btn_type: '',
            btm_btn: langData.reset_pwd.btm_btn,
            btm_btn_url: '/pages/common/login/login',  //按钮链接地址
            btm_btn_type: 'navigate'  //跳转类型
        },
        //场地预定成功页面
        venue: {
            page_title: langData.venue.page_title,
            icon: '/images/icon/result_venue.png',
            title: langData.venue.title,
            des: langData.venue.des,
            details_btn: langData.venue.details_btn,
            details_btn_url: '/pages/user/my-reserve/my-reserve',
            details_btn_type: 'navigate',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        //账单支付成功页面
        pay: {
            page_title: langData.pay.page_title,
            icon: '/images/order/zfcg_img.png',
            title: langData.pay.title,
            des: '',
            details_btn: langData.pay.details_btn,
            details_btn_url: '/pages/order/order-list/order-list',
            details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        //场地预定支付成功页面
        pay_venue: {
            page_title: langData.pay_venue.page_title,
            icon: '/images/order/zfcg_img.png',
            title: langData.pay.title,
            des: '',
            details_btn: langData.pay_venue.details_btn,
            details_btn_url: '/pages/user/my-reserve/my-reserve?tag=1',
            details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        //物资共享申请成功
        wuzi: {
            page_title: langData.wuzi.page_title,
            icon: '/images/icon/result_reg.png',
            title: langData.wuzi.title,
            des: langData.wuzi.des,
            details_btn: langData.wuzi.details_btn,
            details_btn_url: '/pages/supplies/borrowed-record/borrowed-record',
            details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        //在线报修申请成功
        repair: {
            page_title: langData.repair.page_title,
            icon: '/images/icon/result_reg.png',
            title: langData.repair.title,
            des: langData.repair.des,
            details_btn: langData.repair.details_btn,
            details_btn_url: '/pages/user/my-repair/my-repair',
            details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        //活动报名成功
        activity: {
            page_title: langData.activity.page_title,
            icon: '/images/icon/result_bmcg.png',
            title: langData.activity.title,
            des: '',
            details_btn: langData.activity.details_btn,
            details_btn_url: '/pages/activity/activity-apply-details/activity-apply-details',
            details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        //投诉建议成功页
        complaint: {
            page_title: langData.complaint.page_title,
            icon: '/images/icon/result_reg.png',
            title: langData.complaint.title,
            des: '',
            details_btn: langData.complaint.details_btn,
            details_btn_url: '/pages/complaint/complaint-list/complaint-list',
            details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        //推荐预约成功页
        recommend: {
            page_title: langData.recommend.page_title,
            icon: '/images/icon/result_reg.png',
            title: langData.recommend.title,
            des: '',
            // details_btn: '查看历史记录 >>',
            // details_btn_url: '/pages/complaint/complaint-list/complaint-list',
            // details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        //优惠券扫码成功页
        coupon: {
            page_title: langData.coupon.page_title,
            icon: '/images/visitor/result_img03.png',
            title: langData.coupon.title,
            des: '',
            details_btn: langData.coupon.details_btn,
            details_btn_url: '/pages/coupon/my-coupon-list/my-coupon-list',
            details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        //服务下单成功
        serveOrder: {
            page_title: '下单成功',
            icon: '/images/visitor/zfcg_img.png',
            title: '下单成功！',
            des: '请保持联系方式畅通，以便工作人员进行联系。',
            details_btn: '查看订单 >>',
            details_btn_url: '',
            details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
        //服务咨询提交成功
        serveConsult: {
            page_title: '提交成功',
            icon: '/images/visitor/result_reg.png',
            title: '您的咨询已提交！',
            des: '请保持联系方式畅通，以便工作人员进行联系。',
            details_btn: '查看服务详情 >>',
            details_btn_url: '',
            details_btn_type: '',
            btm_btn: langData.backIndexBtn,
            btm_btn_url: '/pages/index/index',
            btm_btn_type: 'switchTab'
        },
    }
    return page_data
}
module.exports = {
    page_data: pageDataFn
}
