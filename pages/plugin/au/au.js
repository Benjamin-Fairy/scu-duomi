// pages/plugin/au/au.js
const app = getApp()
var inJsCode;
const baseUrl = app.globalData.url
Page({
  data: {

  },
  onLoad(options) {
    this.completeLogin()
  },
  onShow() {
    inJsCode = app.globalData.jscode
  },
  completeLogin() {
    wx.showLoading({
      title: '稍等，马上就好',
      mask: true
    })

    if (app.globalData.completeLogin) {
      login()
    } else {
      app.loginReadyCallBack = function (res) {
        login()
      }
    }

    function login() {
      if (!app.userRegister()) {
        return
      }
      wx.login({
        success: res => {
          app.request({
            url: baseUrl + 'user/register/in',
            data: {
              inToken: inJsCode,
              duomiToken: res.code
            },
            success: res => {
              console.log(res)
              wx.hideLoading()
              if (res.data.data.user && res.data.data.user.uid) {
                wx.showToast({
                  title: '成功',
                  icon: "success"
                })
                wx.navigateBackMiniProgram({
                  extraData: {
                    ticket: res.data.data.ticket
                  },
                })
              }
            }
          })
        },
        fail: err => console.log(err)
      })
    }


  }
})