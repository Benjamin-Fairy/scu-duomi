const app = getApp()
const baseUrl = app.globalData.url
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object
    },
    //是否允许跳转到用户详情界面
    navigateToDetail: {
      type: Boolean,
      value: true
    },
    //是否card样式
    cardType: {
      type: Boolean,
      value: true
    },
    //是否限制文本最高宽度
    limitLineHeight: {
      type: Boolean,
      value: true
    },
    //图片是否居中
    imgCenter: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    item: null,
    showPop: false,
    user: {},
    collapse: true,
    changeColor: true,
    now: new Date().getTime()
  },

  lifetimes: {
    attached(e) {
      let _this = this;
      _this.setData({
        // item: _this.properties.item,
        user: app.globalData.user
      })
    },
    detached() {
      this.setData({
        item: null
      })
    },


  },

  /**
   * 组件的方法列表
   */
  methods: {

    //===================简单的方法===============
    //显示为什么
    showWhy() {
      this.hidePop()
      wx.vibrateShort({
        type: 'light',
      })
      wx.showToast({
        title: '被反馈次数过多，或您是反馈者',
        icon: 'none'
      })
    },
    //图片加载后的事件
    imgload(e) {
      this.setData({
        imgProportion: e.detail.width / e.detail.height
      })
    },

    //切换隐藏/显示内容
    toggleContent(e) {
      this.setData({
        collapse: this.data.collapse ? false : true,
      })
      wx.vibrateShort({
        type: 'light',
      })
    },

    //跳转详细页面
    goToDetail(e) {
      let _this = this
      let type = this.data.item.type
      console.log(type)
      if (type == 0 || type == 2) {
        wx.openEmbeddedMiniProgram({
          appId: 'wx2f80896fbecfdaa6',
          path: '/pages/square/squareDeatil/squareDetail?sid=' + _this.data.item.sid + "&type=fromDuomi",
          envVersion: 'trial',
        })
      } else if (type == 1) {
        wx.openEmbeddedMiniProgram({
          appId: 'wx2f80896fbecfdaa6',
          path: '/pages/utils/webview/webview?url=' + encodeURIComponent(_this.data.item.media.url),
          envVersion: 'trial',
        })
      }
    },

    //查看图片
    viewImage(e) {
      let images = e.currentTarget.dataset.images
      let index = e.currentTarget.dataset.index
      for (let i = 0; i < images.length; i++) {
        images[i] = "http://square.chenyipeng.com/" + images[i]
      }
      wx.previewImage({
        urls: images,
        current: images[index]
      })
    }

  }
})