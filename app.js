var e = require("./utils/util.js");

App({
  globalData: {
    url: "https://duomi.chenyipeng.com/pennisetum/",
    // url: "http://localhost:8001/pennisetum/",
    jwurl: 'https://duomi.chenyipeng.com/scu/',
    // https://duomi.chenyipeng.com/scu/
    jwclogin: false,
    user: null,
    ticket: null,
    unReadCount: 0,
    chatMessageList: [],
    limit: 0,
    JSESSIONID_SCU: null,
    completeLogin: false,
    callback: function () {},
    jscode: null
  },
  jwcLogin: function () {
    let _this = this;
    let a = this;
    if (wx.getStorageSync("scu_jwc_username") && wx.getStorageSync("scu_jwc_password")) {
      var t = function (t, a) {

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
              url: _this.globalData.jwurl + "j_spring_security_check",
              header: {
                cookie: a.globalData.JSESSIONID_SCU,
                "content-type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              data: {
                j_username: wx.getStorageSync("scu_jwc_username"),
                j_password: (0, e.md5)(wx.getStorageSync("scu_jwc_password")).toLocaleLowerCase(),
                j_captcha: t,
                tokenValue: token
              },
              success: function (e) {
                if (e.statusCode == 200) {
                  wx.hideLoading()
                  if (e.data.indexOf("验证码错误") == -1 && e.data.indexOf("用户密码错误") == -1) {
                    a.globalData.jwclogin = true
                  }
                }
              },
              fail: function (e) {
                console.log(e);
              }
            });
          }
        })

      }
      wx.request({
        url: _this.globalData.jwurl + "img/captcha.jpg",
        responseType: "arraybuffer",
        header: {
          cookie: this.globalData.JSESSIONID_SCU
        },
        success: function (e) {
          ! function (e, a) {
            wx.request({
              url: "https://duomi.chenyipeng.com/captcha/captcha",
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                type: 0,
                base64img: e
              },
              success: function (e) {
                if (200 == e.data.code) {
                  var o = e.data.captcha;
                  t(o, a);
                }
              }
            });
          }("data:image/png;base64," + wx.arrayBufferToBase64(e.data), a);
        }
      });
    }
  },
  onLaunch: function () {
    var _this = this;
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，请更新后使用？',
            success: function (res) {
              if (res.confirm) {
                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                self.downLoadAndUpdate(updateManager)
              } else if (res.cancel) {
                //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                wx.showModal({
                  title: '温馨提示~',
                  content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                  showCancel: false, //隐藏取消按钮
                  confirmText: "确定更新", //只保留确定更新按钮
                  success: function (res) {
                    if (res.confirm) {
                      //下载新版本，并重新应用
                      self.downLoadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
    wx.request({
      url: _this.globalData.url + "config",
      success: res => {
        for (var a in res.data.data) this.globalData[a] = res.data.data[a];
        this.getSession(function () {
          _this.jwcLogin();
        })
        this.Login();
      },
    })
  },
  onShow: function (info) {

    if (info.scene == '1038' && info.referrerInfo.appId == 'wx2f80896fbecfdaa6' && info.referrerInfo.extraData) {
      if (info.referrerInfo.extraData.type == 1) {
        this.globalData.dxxcode = info.referrerInfo.extraData.code
      }

    }
    if (info.scene == '1037' && info.referrerInfo.appId == 'wx2f80896fbecfdaa6' && info.referrerInfo.extraData) {

      this.globalData.jscode = info.referrerInfo.extraData.jscode

    }
  },
  onError: function (e) {
    console.log(e);
  },
  onHide: function () {},
  Login: function () {
    var e = this;
    wx.login({
      fail: function (e) {
        console.log(e);
      },
      success: function (t) {
        wx.request({
          url: e.globalData.url + "user/login/duomi",
          method: "post",
          data: {
            JSCode: t.code
          },
          header: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          success: function (t) {
            console.log(t.data)
            e.globalData.completeLogin = true
            wx.setStorageSync("user", t.data.user)
            e.globalData.user = t.data.user
            e.globalData.ticket = t.data.ticket
            if (e.loginReadyCallBack) {
              e.loginReadyCallBack(t)
            }
          },
          fail: function (t) {
            e.Login();
          }
        });
      }
    });
  },
  userRegister: function () {
    if (this.globalData.ticket && this.globalData.user && this.globalData.user.uid != 0) {
      return true
    } else {
      wx.showToast({
        title: '需要完成注册环节',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/register/register',
        })
      }, 500)
      return false
    }
  },
  request: function (e) {
    var t = {
      method: "GET",
      data: {},
      url: "#",
      faile: function (e) {},
    };
    for (var a in e) t[a] = e[a];

    t['success'] = function (res) {
      if (res.data.code == 400 || res.data.code == 401) {
        wx.showToast({
          title: '权限不足！',
          icon: 'error'
        })
        return
      }
      e['success'] && e['success'](res)
    }

    t['complete'] = function (res) {
      if (res.data.code == 400 || res.data.code == 401) {
        wx.showToast({
          title: '权限不足！',
          icon: 'error'
        })
        return
      }
      e['complete'] && e['complete'](res)

    }
    t.header ? (t.header.pennisetum = this.globalData.ticket, t.header["content-type"] = "application/x-www-form-urlencoded;charset=utf-8") : t.header = {
      pennisetum: this.globalData.ticket,
      "content-type": "application/x-www-form-urlencoded;charset=utf-8"
    }, wx.request({
      url: t.url,
      data: t.data,
      type: t.method,
      method: t.method,
      header: t.header,
      complete: t.complete,
      success: t.success,
      fail: t.faile
    });
  },
  getSession: function (e) {
    let _this = this;
    e || (e = function () {});
    var t = this;
    wx.request({
      url: _this.globalData.jwurl + "login",
      header: {
        cookie: t.globalData.JSESSIONID_SCU
      },
      success: function (a) {
        var o = a.header["Set-Cookie"];
        if (o) {
          let sessionId = o.split(';')[0]
          t.globalData.JSESSIONID_SCU = sessionId
          t.globalData.JSESSIONID = sessionId.split('=')[1]
          t.globalData.jwclogin = false
        }
        e();
      },
      fail: function (e) {
        console.log('获取session失败')
        console.log(e);
        wx.showModal({
          cancelColor: 'cancelColor',
          content: JSON.stringify(e)
        })
      }
    });
  },
  checkSCULogin: function () {
    wx.showToast({
      title: "请先登录教务处",
      icon: "none"
    })
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/home/login/login"
      });
    }, 1e3);
  },
  requestPromise: function (e, t) {
    var a = this,
      o = this;
    return new Promise(function (n, c, s) {
      o.request({
        url: e,
        data: t,
        header: {
          "content-type": "application/x-www-form-urlencoded",
          Cookie: "JSESSIONID=" + a.globalData.ticket
        },
        success: function (e) {
          n(e);
        },
        fail: function (e) {
          c(e);
        }
      });
    });
  }
});