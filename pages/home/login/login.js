var a = getApp(),
  t = require("../../../utils/util.js");

Page({
  data: {
    url: "",
    img: "",
    login: null,
    captcha: "",
    username: "",
    password: "",
    try: !0,
    jwurl: "",
  },
  onLoad: function (t) {
    this.setData({
      login: a.globalData.login,
      username: wx.getStorageSync("scu_jwc_username"),
      password: wx.getStorageSync("scu_jwc_password"),
      url: a.globalData.url,
      jwurl: a.globalData.jwurl
    }), this.getCaptcha();
  },
  login: function (t) {
    if (this.data.username == '') {
      wx.showToast({
        title: '请输入学号',
        icon: 'error'
      })
      return
    }
    if (this.data.password == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'error'
      })
      return
    }
    wx.showLoading({
      title: "登陆中..."
    });
    var _this = this;
    a.getSession(function () {
      _this.loginMain(_this);
    });
  },
  loginMain: function (e) {
    e.setData({
      logining: true
    })
    wx.request({
      url: a.globalData.jwurl,
      header: {
        cookie: a.globalData.JSESSIONID_SCU,
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        let startIndex = res.data.indexOf('tokenValue')
        let token = res.data.substring(startIndex + 37, startIndex + 69)
        wx.request({
          url: a.globalData.jwurl + "j_spring_security_check",
          header: {
            cookie: a.globalData.JSESSIONID_SCU,
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          data: {
            j_username: e.data.username,
            j_password: t.md5(e.data.password).toLocaleLowerCase(),
            j_captcha: e.data.captcha,
            tokenValue: token
          },
          complete: function (t) {

            console.log(t)
            wx.hideLoading()
            e.setData({
              logining: false
            })
            console.log(t)
            if (200 != t.statusCode) {
              wx.showToast({
                title: "登陆失败，请检查账号密码是否正确！",
                icon: "none"
              });
              return
            }
            if (/用户名:.*不存在/.test(t.data)) {
              e.getCaptcha()
              wx.showToast({
                title: "用户不存在！",
                icon: "none"
              })
              e.setData({
                captcha: "",
                password: "",
                username: '',
                logining: false
              })
              return
            }
            if (t.data.indexOf("验证码错误") != -1) {
              wx.showToast({
                title: "验证码错误！",
                icon: "none"
              })
              e.getCaptcha()
              e.setData({
                captcha: "",
                logining: false
              })
              return
            }
            if (-1 != t.data.indexOf("用户密码错误")) {
              e.getCaptcha()
              wx.showToast({
                title: "用户密码错误",
                icon: "none"
              })
              e.setData({
                captcha: "",
                password: "",
                logining: false
              })
              return
            }
            if (t.data.indexOf("欢迎您") == -1) {
              wx.showToast({
                title: '登陆失败，请重试',
                icon: 'error'
              })
              return
            }
            a.globalData.jwclogin = true
            e.setData({
              login: true
            })
            wx.showToast({
              title: "登陆成功！"
            })
            wx.setStorage({
              data: e.data.username,
              key: "scu_jwc_username"
            })
            wx.setStorage({
              data: e.data.password,
              key: "scu_jwc_password"
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
            }, 1e3)
          },
          fail: function (a) {
            console.log(a);
          }
        });
      }
    })


  },
  getCaptcha: function () {
    var t = this;
    wx.request({
      url: a.globalData.jwurl + "img/captcha.jpg",
      responseType: "arraybuffer",
      header: {
        cookie: a.globalData.JSESSIONID_SCU
      },
      success: function (e) {
        var o = e.header["Set-Cookie"];
        o && (a.globalData.JSESSIONID_SCU = o.split(";")[0], o.split(";")[0] == a.globalData.JSESSIONID_SCU && (a.globalData.jwclogin = !1)),
          t.setData({
            img: "data:image/png;base64," + wx.arrayBufferToBase64(e.data),
            captcha: ""
          }), wx.request({
            url: "https://duomi.chenyipeng.com/captcha",
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              type: 0,
              base64img: t.data.img
            },
            success: function (a) {
              console.log(a), 200 == a.data.code && (t.setData({
                captcha: a.data.captcha
              }), t.data.username && t.data.password && t.data.try && (t.login(), t.setData({
                try: !1
              })));
            }
          });
      },
      fail: function (a) {
        console.log(a);
      }
    });
  },
  bindinput: function (a) {
    var t = a.target.dataset.name,
      e = a.detail.value;
    "username" == t ? this.setData({
      username: e
    }) : "captcha" == t ? this.setData({
      captcha: e
    }) : "password" == t && this.setData({
      password: e
    });
  },
  back: function (a) {
    wx.navigateBack({
      delta: -1
    });
  }
});