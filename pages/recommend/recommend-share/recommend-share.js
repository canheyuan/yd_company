

const app = getApp();  //获取应用实例
const commonFn = require('../../../utils/common.js'); //一些通用的函数
Page({

  data: {
    domainUrl: app.globalData.domainUrl,
    shareId:'',
    shareTagList: ['share_img01_s.jpg', 'share_img02_s.jpg', 'share_img03_s.jpg'],
    shareImgIndex:0,  //小图索引
    imgsInfo: {}, //预加载图片信息
    canvas:[
      { width: 750, height: 2150 },
      { width: 750, height: 2350}
    ],
    scaleNum: 0.5,  //图片缩放比例
    createImgUrl01:null,  //模板图片链接1
    createImgUrl02: null,//模板图片链接2
    canvasShow:true, //canvas是否隐藏
    
    userInfo:null,//用户信息
    detailData:null,  //房源详情

    tjyHide: true, //推荐语是否隐藏
    copyTxt:"",
    shareTxtIndex:0,
    unitImgs: [],

      langData: null,  //语言数据
      langType: '',    //语言类型
  }, 

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    var _this = this;
    this.setData({
      userInfo  : app.globalData.loginInfo.userInfo,
      shareId: options.share_id ? options.share_id:''
      //detailData: detailData,
    });

      //设置语言,判断是否切换语言
      app.loadLangFn(this, 'recommend', (res) => {
          wx.setNavigationBarTitle({ title: res.shareEwmTitle });  //设置当前页面的title
      });
    

    var imgApiUrl = app.globalData.domainUrl; //图片地址前缀
    //预加载获取图片信息
    this.getImgInfoFn('imgsInfo.bg', imgApiUrl + '/images/share/bg01.jpg');
    this.getImgInfoFn('imgsInfo.per_img', _this.data.userInfo.headImgs);
    this.getImgInfoFn('imgsInfo.tri_bg', imgApiUrl + '/images/share/tri_bg.png');
    this.getImgInfoFn('imgsInfo.tri_bg02', imgApiUrl + '/images/share/tri_bg02.png');
    this.getImgInfoFn('imgsInfo.bg2', imgApiUrl + '/images/share/bg02.jpg');
    this.getImgInfoFn('imgsInfo.tit01', imgApiUrl + '/images/share/tit_bg01.png');
    this.getImgInfoFn('imgsInfo.tit02', imgApiUrl + '/images/share/tit_bg02.png');
    this.getImgInfoFn('imgsInfo.tit03', imgApiUrl + '/images/share/tit_bg03.png');
    this.getImgInfoFn('imgsInfo.ewmTip', imgApiUrl + '/images/share/ewm_tip.png');

    if (!this.data.shareId) {
      this.getDetailFn({
        url: '/houseDistribution/myParkDist'
      },function(res){
        _this.createCodeFn(res.distId);
      });
    } else {
      this.getDetailFn({
        url: '/houseDistribution/detail',
        data: { shareId: this.data.shareId }
      },function(res){
        _this.createCodeFn(res.distId, _this.data.shareId);
      });
    }
  },

  //底部小图选项卡切换
  imgTag(e) {
    var index = e.currentTarget.dataset.index;
    if (index == this.data.shareImgIndex) { return; }
    this.setData({ shareImgIndex: index });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  
  //获取详情信息
  getDetailFn(opt, callback) {
    var _this = this;
    app.requestFn({
      url: opt.url,
      data: opt.data,
      success: (res) => {
        console.log("分销详情：", res);
        var detailData = res.data.data ? res.data.data : null;
        if (detailData) {
          detailData.parkImg = detailData.parkImg.split(','); //园区图片
          var shareText = JSON.parse(detailData.shareText) ? JSON.parse(detailData.shareText) : [];
          var unitImgs = [];  //户型所有图片
          for (var i = 0; i < shareText.length; i++) {
            shareText[i] = shareText[i].replace(/\\n/g, '\n');
          }
          detailData.shareText = shareText;

          detailData.parkImg.forEach((item, i) => {
            item = item ? item : (_this.data.domainUrl + "/images/default/df_vbd_pic.jpg");
            _this.getImgInfoFn('imgsInfo.park_img0' + (i + 1), item);
          });
          detailData.unitList.forEach((item, i) => {
            item.imageList.forEach(item2 => {
              if (item2) { unitImgs.push(item2) };
              item2 = item2 ? item2 : (_this.data.domainUrl + "/images/default/df_vbd_pic.jpg");
            })

            _this.getImgInfoFn('imgsInfo.unit_img0' + (i + 1), item.imageList[0]);
          });

          _this.setData({
            detailData: detailData,
            unitImgs: unitImgs,
            copyTxt: detailData.shareText[0]
          });

          callback && callback(detailData);
        }
      }
    });
  },


  //获取图片信息
  getImgInfoFn(obj,url){
    var _this = this;
    wx.getImageInfo({
      src: url,
      success: (res) => {
        _this.setData({ [obj]: res });
      }
    }, this);
  },

  /*****
    // 调用行文本换行函数参数介绍
    this.drawText(ctx, str,左侧距离, 顶部距离, 标题高度, 文本宽度, 行高);
   ******/
  //生成模板图片01
  setImg(callback) {
    var _this= this;
      var langData = this.data.langData;
    this.setData({ canvasShow:false });
      wx.showLoading({ title: langData.public.loadingTip });
    const ctx = wx.createCanvasContext('shareCanvas');//创建画板
    var imgsInfo = this.data.imgsInfo;
    var sNum = this.data.scaleNum;
    ctx.draw(); //先清除之前的画布内容
    ctx.drawImage(imgsInfo.bg.path, 0 * sNum, 0 * sNum, 750 * sNum, 2280 * sNum); //绘制背景图

    //banner奖金文字
    let meneyTxt = _this.data.detailData.shareTitle;
    ctx.setTextAlign('center');
    ctx.setFillStyle('#a307a9');
    ctx.setFontSize(44 * sNum);
    ctx.fillText(meneyTxt, 750/2 * sNum, 604 * sNum);

    ctx.setFillStyle('#ffffff');
    ctx.fillText(meneyTxt, 742 / 2 * sNum, 600 * sNum);

    //园区图片
    this.roundRect(ctx, 46 * sNum, 670 * sNum, 660 * sNum, 316 * sNum, 20 * sNum, imgsInfo.park_img01.path);  

    //参与规则文字
    ctx.setTextAlign('left'); 
    ctx.setFillStyle('#ffffff');
    ctx.setFontSize(32 * sNum);
    let str = _this.data.detailData.shareRule;
    this.drawText(ctx, str, 90 * sNum, 1240 * sNum, 60 * sNum, 540 * sNum, 60 * sNum);// 调用行文本换行函数
    
    //插入头像
    ctx.arc(110 * sNum, 1670 * sNum, 70 * sNum, 0, 2 * Math.PI);
    ctx.setFillStyle('#ffffff');
    ctx.fill();
    this.roundRect(ctx, 45 * sNum, 1605 * sNum, 130 * sNum, 130 * sNum, 65 * sNum, imgsInfo.per_img.path);  

    //插入名字文字
    ctx.setFillStyle('#fee13b');
    ctx.setFontSize(28 * sNum);
    ctx.fillText(_this.data.userInfo.name, 200 * sNum, 1630 * sNum);
    var nameW = ctx.measureText(_this.data.userInfo.name).width;
    ctx.setFillStyle('#91bbd9');
      ctx.fillText(langData.shareText1, 220 * sNum + nameW, 1630 * sNum);

    //输入园区名称
    ctx.setFillStyle('#ffffff');
    ctx.setFontSize(32 * sNum);
    this.drawText(ctx, _this.data.detailData.parkName, 200 * sNum, 1686 * sNum, 60 * sNum, 400 * sNum, 48 * sNum);// 调用行文本换行函数

    //插入二维码
    //var cNameRows = Math.ceil(ctx.measureText(_this.data.detailData.parkName + _this.data.detailData.parkName).width/(470*sNum));  //园区名字
    var cNameRows = 2;
    ctx.rect(240 * sNum, (1680 + cNameRows * 40) * sNum, 280 * sNum, 280 * sNum);
    ctx.setFillStyle('#ffffff');
    ctx.fill();
    ctx.draw(true);
    ctx.drawImage(imgsInfo.ewm.path, 250 * sNum, (1680 + cNameRows*50) * sNum, 260 * sNum, 260 * sNum);

    ctx.setTextAlign('center');
    ctx.setFillStyle('#91bbd9');
    ctx.setFontSize(26 * sNum);
      ctx.fillText(langData.shareText8, 750*sNum/2, 2100 * sNum);

    //画图结束
    ctx.draw(true, function() {
      //生成临时图片地址
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success: (res) => {
          _this.setData({ 
            createImgUrl01: res.tempFilePath,
            canvasShow : true
          });
          callback && callback();
        },
        fail: (res) => {
            wx.showToast({ title: langData.public.previewErrorTip });
        }
      }, _this);
    }); 
    
  },

  //生成模板图片02
  setImg2(callback) {
      var langData = this.data.langData;
      wx.showLoading({ title: langData.public.saveTip });
    var _this = this;
    const ctx = wx.createCanvasContext('shareCanvas');//创建画板
    
    this.setData({ canvasShow: false });
    var sNum = this.data.scaleNum;
    var imgsInfo = this.data.imgsInfo;
    ctx.draw(); //先清除之前的画布内容
    //绘制背景图
    ctx.drawImage(imgsInfo.bg2.path, 0, 0, 750 * sNum, 2360 * sNum); 
     //插入景图01
    ctx.drawImage(imgsInfo.park_img01.path, 92 * sNum, 250 * sNum, 566 * sNum, 272 * sNum);
     //插入三角形
    ctx.drawImage(imgsInfo.tri_bg.path, 68 * sNum, 220 * sNum, 90 * sNum, 90 * sNum);
    //插入标题1背景
    ctx.drawImage(imgsInfo.tit01.path, 50 * sNum, 500 * sNum, 626 * sNum, 114 * sNum);
    ctx.setTextAlign('left');
    ctx.setFillStyle('#ffffff');
    ctx.setFontSize(32*sNum);
   
    this.drawText(ctx, _this.data.detailData.parkName, 170 * sNum, 546 * sNum, 30 * sNum, 400 * sNum, 40 * sNum);// 调用行文本换行函数

    //户型1
    var unitData1 = _this.data.detailData.unitList[0];
    if (unitData1) {
      ctx.drawImage(imgsInfo.unit_img01.path, 100 * sNum, 760 * sNum, 566 * sNum, 272 * sNum);
      //插入标题2背景
      ctx.drawImage(imgsInfo.tit02.path, 66 * sNum, 730 * sNum, 246 * sNum, 56 * sNum);
      ctx.setFontSize(28 * sNum);
        this.drawText(ctx, langData.shareText2, 130 * sNum, 770 * sNum, 30 * sNum, 246 * sNum, 56 * sNum);
      //景图2描述文字
      var unitData1 = _this.data.detailData.unitList[0];
      ctx.setGlobalAlpha(0.5);
      ctx.setFillStyle('black')
      ctx.fillRect(100 * sNum, 970 * sNum, 566 * sNum, 60 * sNum);
      ctx.setGlobalAlpha(1);
      ctx.setTextAlign('left');
      ctx.setFillStyle('#ffffff');
      ctx.setFontSize(30 * sNum);
      ctx.fillText(unitData1.name, 120 * sNum, 1010 * sNum);
      ctx.setTextAlign('right');
      ctx.setFontSize(26 * sNum);
      var areaTxt1 = unitData1.smallestArea + "m²" + (unitData1.biggestArea ? ("～" + unitData1.biggestArea + "m²") : '');
      ctx.fillText(areaTxt1, 650 * sNum, 1010 * sNum);
    }

    //户型2
    var unitData2 = _this.data.detailData.unitList[1];
    if (unitData2){
      if (imgsInfo.unit_img02) {
        ctx.drawImage(imgsInfo.unit_img02.path, 66 * sNum, 1246 * sNum, 566 * sNum, 272 * sNum);
      }
      ctx.drawImage(imgsInfo.tri_bg02.path, 614 * sNum, 1500 * sNum, 76 * sNum, 76 * sNum);   //插入三角形背景

      //户型2描述文字
      ctx.setGlobalAlpha(0.5);
      ctx.setFillStyle('black');
      ctx.fillRect(66 * sNum, 1460 * sNum, 566 * sNum, 60 * sNum);

      ctx.setGlobalAlpha(1);
      ctx.setTextAlign('left');
      ctx.setFillStyle('#ffffff');
      ctx.setFontSize(30 * sNum);
      ctx.fillText(unitData2.name, 80 * sNum, 1500 * sNum);
      ctx.setTextAlign('right');
      ctx.setFontSize(26 * sNum);
      var areaTxt2 = unitData2.smallestArea + "m²" + (unitData2.biggestArea ? ("～" + unitData2.biggestArea + "m²"):'');
      ctx.fillText(areaTxt2, 610 * sNum, 1500 * sNum);
    }
    //插入价钱标题文字
    ctx.drawImage(imgsInfo.tit03.path, 64 * sNum, 1620 * sNum, 656 * sNum, 110 * sNum); 
    ctx.setTextAlign('center');
    ctx.setFillStyle('#ffffff');
    ctx.setFontSize(44 * sNum);
      this.drawText(ctx, '￥' + _this.data.detailData.lowestPrice + langData.shareText3, 750/2 * sNum, 1690 * sNum, 30 * sNum, 500 * sNum, 56 * sNum);
    
    //插入头像
    ctx.arc(160 * sNum, 1940 * sNum, 70 * sNum, 0, 2 * Math.PI);
    ctx.setFillStyle('#ffffff');
    ctx.fill();
    this.roundRect(ctx, 95 * sNum, 1875 * sNum, 130 * sNum, 130 * sNum, 65 * sNum, imgsInfo.per_img.path); 
    
    //插入文字
    ctx.setTextAlign('left');
    ctx.setFillStyle('#333333');
    ctx.setFontSize(32 * sNum);
    this.drawText(ctx, _this.data.detailData.shareTitle, 260 * sNum, 1900 * sNum, 30 * sNum, 500 * sNum, 56 * sNum);
    //插入园区名称
    ctx.setFillStyle('#9d9d9d');
    ctx.setFontSize(30 * sNum);
    this.drawText(ctx, _this.data.detailData.parkName, 260 * sNum, 1960 * sNum, 30 * sNum, 400 * sNum, 40 * sNum);

    //插入提示图片
    ctx.drawImage(imgsInfo.ewmTip.path, 0 * sNum, 2070 * sNum, 540 * sNum, 320 * sNum); 
    //插入二维码
    ctx.drawImage(imgsInfo.ewm.path, 430 * sNum, 2110 * sNum, 220 * sNum, 220 * sNum);

    //画图结束
    ctx.draw(true, ()=>{
      //生成临时图片地址
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success: (res) => {
          _this.setData({ 
            createImgUrl02: res.tempFilePath,
            canvasShow: true
          });
          callback && callback();
        },
        fail: (res) => {
            wx.showToast({ title: langData.public.previewErrorTip });
        }
      }, _this);
    }); 

  },

  //图片设置圆角
  roundRect(ctx, x, y, w, h, r,url) {
    ctx.save();
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    //ctx.setFillStyle('transparent')
    ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    //ctx.fill()
    ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip();
    ctx.drawImage(url, x, y, w, h); //插入景图
    ctx.restore();
    ctx.draw(true);
  },

  //预览生成图片
  previewImgFn(e){
    var _this = this;
    var currentImgUrl = '';
    if (_this.data.shareImgIndex == 0) {
      currentImgUrl = _this.data.createImgUrl01;
    } else {
      currentImgUrl = _this.data.createImgUrl02;
    }
    console.log('currentImgUrl：', currentImgUrl);
    //预览图片
    if (currentImgUrl) {
      wx.previewImage({
        urls: [currentImgUrl],
        current: currentImgUrl
      });
      return;
    }


    if (_this.data.shareImgIndex == 0) {
      _this.setImg(() => {
        wx.hideLoading();
        wx.previewImage({
          urls: [_this.data.createImgUrl01],
          current: _this.data.createImgUrl01
        });
      });
    } else {
      _this.setImg2(() => {
        wx.hideLoading();
        wx.previewImage({
          urls: [_this.data.createImgUrl02],
          current: _this.data.createImgUrl02
        });
      });
    }
    

  },

  //保存生成图片
  downImg(e) {
    var _this = this;
    var langData = this.data.langData;
    var currentImgUrl = '';

    if (_this.data.shareImgIndex == 0) {
      currentImgUrl = _this.data.createImgUrl01;
    } else {
      currentImgUrl = _this.data.createImgUrl02;
    }

    //保存图片
    if (currentImgUrl) {
      wx.saveImageToPhotosAlbum({
        filePath: currentImgUrl,
        success: (res) => {
            wx.showToast({ title: langData.public.saveImgSuccessTip });
        },
        fail: (res) => {
            wx.showToast({ title: langData.public.saveImgErrorTip });
        }
      });
      return;
    }

    if (_this.data.shareImgIndex == 0) {

      _this.setImg(() => {
        wx.hideLoading();
        wx.saveImageToPhotosAlbum({
          filePath: _this.data.createImgUrl01,
          success: (res) => {
              wx.showToast({ title: langData.public.saveImgSuccessTip });
          },
          fail: (res) => {
              wx.showToast({ title: langData.public.saveImgErrorTip });
          }
        });
      });
      
    } else {
      _this.setImg2(() => {
        wx.hideLoading();
        wx.saveImageToPhotosAlbum({
          filePath: _this.data.createImgUrl02,
          success: (res) => {
              wx.showToast({ title: langData.public.saveImgSuccessTip });
          },
          fail: (res) => {
              wx.showToast({ title: langData.public.saveImgErrorTip });
          }
        });
      });
    }
    
  
  },

  //设置文字换行
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth,lineHeight) {
    let lineWidth = 0;
    let lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += lineHeight; //22为 文字大小20 + 2
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 22;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight;
  },

  //推荐语弹窗打开隐藏
  tjyPopFn(){
    this.setData({ tjyHide: !this.data.tjyHide});
  },

  //生成小程序二维码
  createCodeFn(distId, shareId){
    //提交预约信息
    app.requestFn({
      url: `/houseDistribution/genMaCode`,
      header: 'application/x-www-form-urlencoded',
      data: {
        distId: distId,
        shareId: shareId
      },
      method: 'POST',
      success: (res) => {
        this.getImgInfoFn('imgsInfo.ewm', res.data.data);
      }
    });
  },

  //复制到剪切板
  copyTxtFn(e){
    var _this=this;
    wx.setClipboardData({
      data: this.data.copyTxt,
      success(res) {
        wx.getClipboardData({
          success(res) {
            _this.tjyPopFn();
            console.log(res.data) // data
          }
        })
      }
    })
  },

  //换一个推荐语
  replaceTxtFn(e){
    var shareText = this.data.detailData.shareText;
    var shareTxtIndex = this.data.shareTxtIndex;
    if (shareTxtIndex < shareText.length){
      this.setData({ 
        shareTxtIndex: shareTxtIndex+1,
        copyTxt: shareText[shareTxtIndex] 
      });
    }else{
      this.setData({
        shareTxtIndex:0,
        copyTxt: shareText[0] 
      });
    }
    
  },

  //下载图片
  downLoadImgFn(e) {
    var imgList = this.data.unitImgs;
    var numSuccess = 0;  //计算下载成功几张图
    var numSum = 0;      // 总图数
    function finishFn() {
      numSum++;
      if (numSum > imgList.length - 1) {
        wx.hideLoading();
        if (numSuccess < numSum) {
          wx.showToast({ title: `有${numSum - numSuccess}张保存失败`, icon: 'none', duration: 3000 })
        } else {
          wx.showToast({ title: `已下载` });
        }
      }
    }
    wx.showLoading({ title: `下载中${numSum}/${imgList.length}` });
    imgList.forEach(item => {
      wx.getImageInfo({
        src: item,
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.path,
            success: (res) => {
              numSuccess++;
              wx.showLoading({ title: `下载中  ${numSuccess}/${imgList.length}` });
            },
            complete: () => {
              finishFn();
            }
          });
        },
        fail: () => {
          finishFn();
        }
      }, this);
    })

  },

  //预览图片
  previewImg(e) {
    var imgList = this.data.unitImgs;
    var currentImg = e.currentTarget.dataset.img;
    app.previewImgFn(currentImg, imgList);
  },


  //图片加载失败显示默认图
  errorImgFn(e) {
    //有三个参数：当前页面this，要替换的对象，替换图片地址
    commonFn.errorImg(this, e.currentTarget.dataset.obj, e.currentTarget.dataset.img);

    //重新加载默认图
    this.data.detailData.parkImg.forEach((item, i) => {
      this.getImgInfoFn('imgsInfo.img0' + (i + 1), item);
    });
    this.data.detailData.unitList.forEach((item, i) => {
      this.getImgInfoFn('imgsInfo.img0' + (i + 2), item.image);
    });
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})