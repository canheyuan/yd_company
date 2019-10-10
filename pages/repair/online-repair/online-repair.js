

const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
Page({

    data: {
        domainUrl: app.globalData.domainUrl,
        contactsName: '',  //联系人
        contactsPhone: '', //联系人电话
        bxTypeList: [],  //报修类型数组
        bxTypeIndex: null,
        roomList: [],  //房间号数组
        roomIndex: null,
        servicesList: [],  //服务价格一览表
        popIsShow: true, //服务价格一览表弹窗是否显示
        fileImgs: [],  //上传图片
        fileImgsNum: 3,  //可以上传的图片个数，最多三张
        formSubmitStatus: false, //提交状态，控制不重复提交（true：提交中，false：未提交）

        langData: null,  //语言数据
        langType: '',    //语言类型
    },

    onLoad: function (options) {

        //设置语言,判断是否切换语言
        app.loadLangFn(this, 'repair', (res) => {
            wx.setNavigationBarTitle({ title: res.repairTitle });  //设置当前页面的title
            this.getRepairInfo();
        });

    },

    //获取报修信息
    getRepairInfo() {
        var _this = this;
        //加载完页面获取数据
        app.requestFn({
            url: `/estateRepair/info`,
            success: (res) => {
                var datas = res.data.data;
                console.log("在线报修选项卡数据：", datas);
                _this.setData({
                    bxTypeList: datas.types,
                    roomList: datas.rooms,
                    servicesList: datas.services,
                    contactsName: app.globalData.loginInfo.userInfo.name,
                    contactsPhone: app.globalData.loginInfo.userInfo.cellphone
                    // contactsName: datas.contact,
                    // contactsPhone: datas.phone
                });
                // if (!datas.rooms) {
                //     wx.showToast({ title: _this.data.langData.noRepairTip, icon: 'none', duration: 3000 });
                // }
            }
        });
    },

    //选择报修类型
    bxTypeListFn(e) {
        console.log(e);
        this.setData({
            bxTypeIndex: e.detail.value
        })
    },

    //选择房间号
    roomListFn(e) {
        console.log(e);
        this.setData({
            roomIndex: e.detail.value
        })
    },

    //上传图片
    fileImageFn() {
        var _this = this;
        wx.chooseImage({
            count: _this.data.fileImgsNum, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                var list = _this.data.fileImgs.concat(tempFilePaths);
                _this.setData({
                    fileImgsNum: _this.data.fileImgsNum - tempFilePaths.length,
                    fileImgs: list
                })
                console.log(_this.data.fileImgs);
            }
        })
    },

    //删除预览图
    removeImageFn(e) {
        var removeIndex = e.currentTarget.dataset.index;
        var imgArr = this.data.fileImgs;
        console.log(removeIndex);
        imgArr.splice(removeIndex, 1);
        this.setData({
            fileImgsNum: 3 - imgArr.length,
            fileImgs: imgArr
        })
    },

    //打开关闭服务价格一览表弹窗
    popFn() {
        this.setData({
            popIsShow: !this.data.popIsShow
        })
    },

    //提交报修
    formSubmit(e) {

        var _this = this;
        var langData = this.data.langData;
        var datas = e.detail.value;
        var formId = e.detail.formId;
        var fileNum = 0;
        var fileImgs = this.data.fileImgs;

        //console.log(datas);

        if (!datas.typeId) {
            wx.showToast({ title: langData.repairType, icon: 'none', duration: 2000 });
            return;
        }
        if (!datas.unitId) {
            wx.showToast({ title: langData.repartRoomTip, icon: 'none', duration: 2000 });
            return;
        }
        if (datas.contact == '') {
            wx.showToast({ title: langData.contactTip, icon: 'none', duration: 2000 });
            return;
        }
        if (!commonFn.phoneregFn(datas.phone)) {
            wx.showToast({ title: langData.phoneTip, icon: 'none', duration: 2000 });
            return;
        }
        if (this.data.formSubmitStatus) {    //控制不重复提交
            return;
        } else {
            _this.setData({
                formSubmitStatus: true
            })
        }
        //上传图片文件
        fileImgs.forEach((item, i) => {
            wx.uploadFile({
                url: app.globalData.jkUrl + '/uploadImage',
                filePath: item,
                name: 'file',
                header: {
                    '5ipark-sid': app.globalData.sessionId
                },
                formData: {
                    'entityId': '',
                    'entityType': 'estaterepair',
                    'appCode': ''
                },
                success(res) {
                    console.log('头像：', res)
                    var datas = JSON.parse(res.data);
                    if (datas.code == 0) {
                        const changeImg = datas.data.filePath;
                        const changeImg2 = datas.data.urlPath;
                        fileImgs[i] = changeImg;
                        fileNum++;
                    }
                }, fail(err) {
                    console.log(err);
                }
            });
        });

        var timer = setInterval(() => {
            if (fileNum == fileImgs.length) {
                clearInterval(timer);
                if (fileImgs.length > 0) {
                    datas.images = this.data.fileImgs.reduce((prev, cur) => {
                        return prev + ',' + cur
                    })
                } else {
                    datas.images = '';
                }
                //console.log('上传的参数：', datas);
                //提交formId
                app.getFormIdFn(formId, () => {
                    app.requestFn({
                        loadTitle: langData.submitRepairTip,
                        url: `/estateRepair/apply`,
                        data: datas,
                        header: 'application/x-www-form-urlencoded',
                        method: 'POST',
                        success: (res) => {
                            wx.redirectTo({
                                url: '/pages/common/result/result?page=repair',
                            })
                        },
                        complete() {
                            _this.setData({ formSubmitStatus: false })
                        }
                    });
                })
            }
        }, 300);
    }
})
