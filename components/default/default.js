const app = getApp(); //获取应用实例

Component({
    //组件的属性列表
    properties: {
        mName: String,     //目标模块
        mClass: String,    //添加的class
        mNum: {  //列表显示的个数
            type: Number,
            value:5
        }, 
        mTop: Number,    //仅用于返回按钮，与底部的距离
        isShow: Boolean, //仅用于返回按钮是否显示
    },

    //组件的初始数据
    data: {
        domainUrl: app.globalData.domainUrl,
        backTopShow:true
    },

    //组件的方法列表
    methods: {
        //返回顶部按钮
        backTopFn() {
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 300
            })
        },
    }
})
