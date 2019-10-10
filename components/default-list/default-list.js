// components/default-list/default-list.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        layout: { //语言数据改变
            type: String,
            observer: function (newVal, oldVal, changedPath) {  //动态改变属性时执行
                this.setData({
                    layoutClass: newVal
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        layoutClass:''
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
