
const app = getApp();   //获取应用实例
Component({
  //组件的属性列表
  properties: {
    closeBtnShow: Boolean,
  },

  //组件的初始数据
  data: {
    domainUrl: app.globalData.domainUrl,
    isShow: true,
    closeBtnShow: false,
     langData: null,  //语言数据
    },

    //组件加载完成后
    attached() {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'cpAuditTip');

        this.setData({
            closeBtnShow: this.properties.closeBtnShow ? this.properties.closeBtnShow : false
        })

    },

    //组件的方法列表
    methods: {

    }
})
