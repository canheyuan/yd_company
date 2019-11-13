const app = getApp(); //获取应用实例
Component({
  //
  properties: {
    
    index:{
      type: String,
      observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
        this.setData({ tagIndex: newVal });
      }
    },

    langChange:{
      type:String,
      observer: function(newVal , oldVal ,changedPath){
        app.loadLangFn(this, 'cpTab', (res) => {
          this.setData({
            tagList: [
                { title: res.menuText1, link: '/pages/index/index', icoClass: 'ico01' },
                { title: res.menuText2, link: '/pages/menu-tabs/found-index/found-index', icoClass: 'ico02' },
                { title: res.menuText3, link: '/pages/menu-tabs/serve-index/serve-index', icoClass: 'ico03' },
                { title: res.menuText4, link: '/pages/menu-tabs/user-index/user-index', icoClass: 'ico04' }
            ]
          })
        });
      }
    }
  },

  //组件的初始数据
  data: {
    tagList:[],
    tagIndex:0
  },

  attached() {
    
  },

  //组件的方法列表
  methods: {
    
  }
})