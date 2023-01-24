const app = getApp()
const xieyi = require('./xieyi').xieyi
Page({
  data: {
    active: 'home',
    xieyi: xieyi,
    squareShow: false,
    url: app.globalData.url,
    safeBottom: app.globalData.safeBottom
  },
  onShow() {
    var e = this;
    if (!wx.getStorageSync('xieyi')) {
      this.setData({
        modalName: 'xieyi'
      })
    }
    e.setData({
      isShow: !0,
      squareShow: new Date().getTime() > 1674138303328
    })
    wx.request({
      url: e.data.url + "getInformation",
      success: function (a) {
        200 != a.statusCode && e.setData({
          msg: "服务端维护升级中，请稍后访问",
          show: !0
        }), "" != a.data.msg && wx.getStorageSync("information") != a.data.msg && (wx.setStorageSync("information", a.data.msg),
          e.setData({
            msg: a.data.msg,
            show: !0
          }));
      },
      fail: function (a) {
        console.log(a), e.setData({
          msg: "服务端维护升级中，请稍后访问",
          show: !0
        });
      }
    });
  },
  onLoad(options) {

  },
  scroll: function (e) {
    e.detail.scrollHeight - 500 < e.detail.scrollTop && (this.setData({
      readDone: !0
    }), console.log(""), wx.showToast({
      title: '阅读完成',
      icon: 'none'
    }));
  },
  readCheck: function (e) {
    0 == e.detail.value.length ? this.setData({
      readCheck: 0
    }) : this.setData({
      readCheck: 1
    });
  },
  NavChange(e) {
    console.log(e.currentTarget.dataset.cur)
    this.setData({
      active: e.currentTarget.dataset.cur
    })
  },
  xieyiConfirm(e) {

    if (!this.data.readDone) {
      wx.showToast({
        title: '请先阅读完上述条款',
        icon: 'none'
      })
      return
    }
    if (!this.data.readCheck) {
      wx.showToast({
        title: '未同意隐私条款',
        icon: 'none'
      })
      return
    }
    wx.setStorageSync('xieyi', true)
    this.setData({
      modalName: ''
    })
  },
  hideModal: function () {
    this.setData({
      modalName: ""
    });
  },
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

  onShareAppMessage: function (t) {
    return {
      title: "一个小程序",
      path: this.route
    };
  }
})