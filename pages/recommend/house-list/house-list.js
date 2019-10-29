const app = getApp()//  //获取应用实例
var commonFn = require('../../../utils/common.js');//一些通用的函数

Page({
    data: {
        domainUrl: app.globalData.domainUrl,
        langData: null,  //语言数据
        langType: '',    //语言类型
        listInfo:{
            list:[
                {
                    title:'1广佛一期二号楼303',
                    area:30,
                    address:'广佛数字创意园',
                    price:100,
                    img:'https://5iparks.com/profile/2019/09/76cdfa9eb25ad34f6dd9b24a024ccffa.jpg',
                    des:'描述1描述1描述1描述1描述1描述1'
                },
                {
                    title: '2广佛一期二号楼303',
                    area: 30,
                    address: '广佛数字创意园',
                    price: 100,
                    img: 'https://5iparks.com/profile/2019/09/29d625397848423dcdce400c71178e46.jpg',
                    des: '描述222描述222描述222描述222描述222描述222描述222描述222描述222描述222描述222描述222描述222描述222描述222'
                },
                {
                    title: '3广佛一期二号楼303',
                    area: 30,
                    address: '广佛数字创意园',
                    price: 100,
                    img: 'https://5iparks.com/profile/2019/09/c5205f4ba202912b9c09720f955b2dce.jpg',
                    des: '描述1描述1描述1描述1描述1描述1'
                },
                {
                    title: '4广佛一期二号楼303',
                    area: 30,
                    address: '广佛数字创意园',
                    price: 100,
                    img: 'https://5iparks.com/profile/2019/09/2bfa9ddf04942d34e2f1f399ac412af5.jpg',
                    des: '描述1描述1描述1描述1描述1描述1'
                },
                {
                    title: '5广佛一期二号楼303',
                    area: 30,
                    address: '广佛数字创意园',
                    price: 100,
                    img: 'https://5iparks.com/profile/2019/09/343a273bafc44f7d92e95027a47adc31.png',
                    des: '描述1描述1描述1描述1描述1描述1'
                }
            ]
        }

        
    },

    onLoad: function (options) {
        var backUrl = { url: '/' + commonFn.getCurrentPageUrl(), type: 'navigateTo' };
        wx.setStorageSync('backUrl', backUrl);

    },


    //用户点击右上角分享
    onShareAppMessage: function (e) {

    },

    //图片加载失败显示默认图
    errorImgFn(e) {
        //有三个参数：当前页面this，要替换的对象，替换图片地址
        commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);
    },

})
