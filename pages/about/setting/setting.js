var a = getApp();
const nameArray = require('../../register/name').nameArray
Page({
  data: {
    url: "",
    TabCur: 0,
    scrollLeft: 0,
    user: null,
    captchaGetting: false,
    emailCapctha: '',
    leftTimes: 30,
    itemList: [{
      name: "个人信息",
      icon: "peoplefill",
      color: "blue"
    }, {
      name: "教务处账号",
      icon: "upstagefill",
      color: "orange"
    }, {
      name: "校区修改",
      icon: "homefill",
      color: "cyan"
    }]
  },
  updateEmail() {
    let _this = this
    let email = _this.data.email
    let captcha = _this.data.emailCapctha
    if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
      wx.showToast({
        title: '请输入正确地邮箱',
        icon: 'error'
      })
    } else if (captcha == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'error'
      })
    }
    a.request({
      url: _this.data.url + 'user/updateEmail',
      data: {
        email: email,
        captcha: captcha
      },
      success: res => {
        if (res.data.code != 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'error'
          })
          return
        } else {
          wx.showToast({
            title: '修改邮箱成功！',
          })
        }
      }
    })
  },
  onLoad: function (t) {
    this.setData({
      url: a.globalData.url,
      user: a.globalData.user,
      email: a.globalData.user.email,
      scu_jwc_username: wx.getStorageSync("scu_jwc_username"),
      scu_jwc_password: wx.getStorageSync("scu_jwc_password")
    });
    var e = wx.getStorageSync("campus");
    e = e || "wangjiang", this.setData({
      campus: e
    });
  },
  //选择头像
  chooseAvatar(e) {
    let _this = this
    let type = e.currentTarget.dataset.type
    if (type == 2) {
      wx.showModal({
        title: '提示',
        content: '是否更新头像？',
        success: res => {
          if (res.confirm) {
            wx.showLoading({
              title: '更新中',
            })
            wx.uploadFile({
              filePath: e.detail.avatarUrl,
              name: 'file',
              url: a.globalData.url + "user/updateAvatar",
              header: {
                pennisetum: a.globalData.ticket
              },
              success: res => {
                res.data = JSON.parse(res.data)
                a.globalData.user = res.data.data
                _this.setData({
                  user: res.data.data,
                  modalName: ''
                })
                wx.hideLoading()
                wx.showToast({
                  title: '更新成功',
                })

              }
            })
          }
        }
      })
    } else {
      let gender = e.currentTarget.dataset.gender
      let index = e.currentTarget.dataset.index
      let avatarUrl = 'https://duomi.chenyipeng.com/static/avatar/' + gender + '-' + index + '.png'
      let user = this.data.user
      user.avatarUrl = avatarUrl
      this.setData({
        user: user,
        modalName: '',
        canSubmit: true
      })
    }

  },
  //获取验证码
  getCaptcha() {
    let _this = this
    if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(_this.data.email)) {
      wx.showToast({
        title: '请输入正确的邮箱！',
        icon: 'error'
      })
      return
    }
    if (_this.data.captchaGetting) return
    _this.setData({
      captchaGetting: true
    })
    let s = setInterval(() => {
      if (this.data.leftTimes == 0) {
        clearInterval(s)
        _this.setData({
          leftTimes: 30,
          captchaGetting: false
        })
      } else {
        _this.setData({
          leftTimes: this.data.leftTimes - 1
        })
      }
    }, 1000)

    //发送请求
    a.request({
      url: _this.data.url + 'user/getCaptcha',
      data: {
        email: _this.data.email,
        type: 1
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '验证码获取成功！',
        })
      }
    })

  },
  //修改校区
  campusChange: function (a) {
    wx.setStorageSync("campus", a.detail.value), this.setData({
      campus: a.detail.value
    }), wx.showToast({
      title: "修改成功"
    });
  },
  //修改校务处信息
  changeJwcInfo: function (t) {
    wx.setStorageSync("scu_jwc_username", this.data.scu_jwc_username), wx.setStorageSync("scu_jwc_password", this.data.scu_jwc_password),
      a.globalData.JSESSIONID_SCU = null, a.globalData.jwclogin = !1, wx.showToast({
        title: "修改成功！",
        icon: "success"
      });
  },
  //删除教务处信息
  delJwcInfo: function (t) {
    wx.removeStorageSync("scu_jwc_username"), wx.removeStorageSync("scu_jwc_password"),
      a.globalData.JSESSIONID_SCU = null, a.globalData.jwclogin = !1, this.setData({
        scu_jwc_username: "",
        scu_jwc_password: ""
      }), wx.showToast({
        title: "删除成功！",
        icon: "success"
      });
  },
  //更新用户信息
  updateUserInfo: function () {
    var t = this;
    if (t.data.canSubmit) {
      if (t.data.user.nickName && t.data.user.nickName.trim() == '') {
        wx.showToast({
          title: '昵称不能为空',
          icon: 'none'
        })
        return
      }
      if (t.data.user.nickName && t.data.user.nickName.trim().length > 10) {
        wx.showToast({
          title: '昵称过长，稍微修改下呗',
          icon: 'none'
        })
        return
      }
      a.request({
        url: t.data.url + "user/update",
        data: {
          email: t.data.email,
          nickName: t.data.user.nickName,
          gender: t.data.user.gender,
          avatarUrl: t.data.user.avatarUrl
        },
        success: function (e) {
          console.log(e), a.globalData.user = e.data.user, wx.showToast({
            title: "修改成功",
            icon: "success"
          }), t.setData({
            canSubmit: !1
          });
        }
      })
    } else {
      wx.showToast({
        title: "未作修改",
        icon: "error"
      })
    }
  },
  emailInput: function (a) {
    var t = this.data.user
    t.email = a.detail.value
    this.setData({
      email: a.detail.value,
      user: t,
      canSubmit: !0
    });
  },
  randNickName() {
    let headName = nameArray.headerName[Math.floor(Math.random() * nameArray.headerName.length)]
    let foodName = nameArray.foodName[Math.floor(Math.random() * nameArray.foodName.length)]
    var t = this.data.user;
    t.nickName = headName + foodName
     this.setData({
      nickName: headName + foodName,
      user: t,
      canSubmit: !0
    });
  },
  nicknameInput: function (a) {
    var t = this.data.user;
    t.nickName = a.detail.value
     this.setData({
      nickName: a.detail.value,
      user: t,
      canSubmit: !0
    });
  },
  chooseGender: function (a) {
    var t = this.data.user,
      e = a.detail.value;
    t.gender = parseInt(e), this.setData({
      gender: parseInt(e),
      user: t,
      canSubmit: !0
    });
  },
  jwcUsernameInput: function (a) {
    this.setData({
      scu_jwc_username: a.detail.value
    });
  },
  jwcPasswordInput: function (a) {
    this.setData({
      scu_jwc_password: a.detail.value
    });
  },
  showModal: function (a) {
    a.currentTarget.dataset.disabled ? wx.showToast({
      title: "无法修改此字段",
      icon: "none"
    }) : this.setData({
      modalName: a.currentTarget.dataset.target
    });
  },
  hideModal: function (a) {
    this.setData({
      modalName: null
    });
  },
  tabSelect: function (a) {
    wx.setNavigationBarTitle({
      title: this.data.itemList[a.currentTarget.dataset.id].name
    }), this.setData({
      TabCur: a.currentTarget.dataset.id,
      scrollLeft: 60 * (a.currentTarget.dataset.id - 1),
      modalName: null
    });
  }
});