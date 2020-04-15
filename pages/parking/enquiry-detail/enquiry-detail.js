const app = getApp();  //获取应用实例
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        carDetail:null,
        carPlate : '',   //车牌号
        eqnquiryErrorShow:false,
    },
    onLoad(options){
        if(options.code){
            this.setData({carPlate : options.code })
        }
    },

    onShow: function () {
        this.getParkingMonthlyFn(this.data.carPlate)
    },

    //车牌查询月保信息
    getParkingMonthlyFn(carPlate) {
        app.requestFn({
            url: `/parkingMonthly/detail/${carPlate}`,
            success: (res) => {
                var carDetail = res.data.data;
                this.dataTidy(carDetail)
            },
            isOtherTip:false,
            successOther:(res)=>{
                if(res.data.code !=0){
                    this.setData({ eqnquiryErrorShow : true })
                }
            }
        });
    },

    dataTidy(carDetail){
        var carDetail = carDetail
        carDetail.expiredDate = carDetail.expiredDate?carDetail.expiredDate.substring(0,11):null
        switch(carDetail.status){
            case 0:
                carDetail.statusName = '未交费'
                carDetail.statusClass = 'red'
                break;
            case 1:
                carDetail.statusName = '生效中'
                carDetail.statusClass = 'green'
                break;
            case 2:
                carDetail.statusName = '未生效'
                carDetail.statusClass = 'red'
                break;
            case 3:
                carDetail.statusName = '已停用'
                carDetail.statusClass = 'red'
                break;
        }
        this.setData({carDetail : carDetail})
    },

    //立即支付按钮点击
    payBtnFn(e){
        if(this.data.carDetail.status == 2){
            wx.showToast({
                title: '暂不可缴费，请联系物业管理员!',
                icon: 'none',
                duration: 3000
            })
        }else{
            var url = e.currentTarget.dataset.url
            wx.navigateTo({ url: url })
        }
        
    },

    //关闭查询提示弹窗
    closeEqnquiryErrorPop(){
        this.setData({ eqnquiryErrorShow : !this.data.eqnquiryErrorShow })
    }

    
})