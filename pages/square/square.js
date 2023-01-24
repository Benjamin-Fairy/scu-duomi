// pages/square/index/index.js
const app = getApp()
const baseUrl = app.globalData.url;
var isShow = 1
var lastTapStamp = 0
Component({
  /**
   * 页面的初始数据
   */
  data: {

    user: null,

  },

  lifetimes: {
    attached(options) {

      this.setData({
        user: app.globalData.user
      })
    },
  },
  methods: {
    open() {
      if (!app.globalData.ticket) {
        wx.showToast({
          title: '你尚未注册或正在登录，请完成登陆后点击。',
          icon: 'none'
        })
        e.userRegister(null, false)
        return
      }
      if (!app.globalData.user.openidIn) {
        wx.showLoading({
          title: '稍等',
        })
        wx.login({
          success: res => {
            wx.hideLoading({
              success: (res) => { },
            })
            wx.openEmbeddedMiniProgram({
              appId: 'wx2f80896fbecfdaa6',
              path: '/pages/me/index/index',
              extraData: {
                jscode: res.code
              },
            })
          }
        })
      } else {
        wx.openEmbeddedMiniProgram({
          appId: 'wx2f80896fbecfdaa6',
          path: '/pages/square/index/index'
        })
      }
    },
  }


})