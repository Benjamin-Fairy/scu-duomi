var t = getApp(),
  e = null;

Page({
  data: {
    url: "",
    isAdding: "",
    modalName: "modal1",
    mine: null,
    alert: {},
    user: null,
    user_username: "",
    user_password: ""
  },
  onLoad: function (a) {
    var n = this;
    // wx.createInterstitialAd && ((e = wx.createInterstitialAd({
    //     adUnitId: "adunit-da1cc2aaa63bb5cd"
    // })).onLoad(function(t) {
    //     n.adcallback && n.adcallback(e);
    // }), e.onError(function(t) {
    //     return console.log(t);
    // }), e.onClose(function() {})), a && a.description && this.setData({
    //     modalName: "initModal",
    //     alert: {
    //         time: a.time,
    //         date: a.date,
    //         description: a.description
    //     }
    // })
    this.setData({
      now: new Date().getHours(),
      url: t.globalData.url,
      user: t.globalData.user
    });
    var i = this;

    function o() {
      t.request({
        url: i.data.url + "healthPunchIn/getMySignIn",
        success: function (t) {
          console.log(t), i.setData({
            mine: t.data.mine ? t.data.mine : null
          });
        },
        complete: function (t) {
          wx.hideLoading();
        }
      });
    }
    wx.showLoading({
      title: "加载中"
    }), t.globalData.user ? o() : t.loginReadyCallBack = function (t) {
      o();
    };
  },
  toggleOn: function (e) {
    if (t.userRegister()) {
      var a = e.detail.value,
        n = this;
      t.request({
        url: n.data.url + "healthPunchIn/signInConfirm",
        success: function (t) {
          400 != t.data.code ? (n.setData({
            mine: t.data.mine
          }), 200 == t.data.code && 1 == a ? wx.showToast({
            title: "开启成功！"
          }) : 200 == t.data.code && 0 == a && wx.showToast({
            title: "关闭成功！"
          })) : wx.showToast({
            title: "权限不足！",
            icon: "error"
          });
        }
      });
    }
  },
  signin: function (e) {
    wx.showLoading({
      title: "操作中"
    });
    var a = this;
    t.request({
      url: a.data.url + "healthPunchIn/signin",
      success: function (t) {
        wx.hideLoading(), 200 == t.data.code ? wx.showToast({
          title: "操作成功",
          icon: "success"
        }) : wx.showToast({
          title: "出错啦，稍后再试",
          icon: "error"
        }), setTimeout(function () {
          a.onLoad();
        }, 600);
      }
    });
  },
  toggleInform: function (e) {
    var a = this;
    if (t.userRegister()) {
      if (!t.globalData.user.email || "" == t.globalData.user.email.trim()) {
        wx.showToast({
          title: "请先设置邮箱",
          icon: "error"
        }), setTimeout(function () {
          wx.navigateTo({
            url: "/pages/about/setting/setting"
          });
        }, 800);
        var n = a.data.mine;
        return n.alert = 0, void a.setData({
          mine: n
        });
      }
      this.data.mine && 0 == this.data.mine.alert ? (i(), wx.showToast({
        title: "开启成功！"
      })) : (i(), wx.showToast({
        title: "关闭成功！"
      }));
    }

    function i() {
      t.request({
        url: a.data.url + "healthPunchIn/signInAlert",
        success: function (t) {
          a.setData({
            mine: t.data.mine
          });
        }
      });
    }
  },
  add: function (e) {
    if (!t.userRegister()) return
    var a = this
    let n = this.data.user_username
    let i = this.data.user_password;
    console.log(n)
    if (n == '') {
      wx.showToast({
        title: "请输入学号",
        icon: "error"
      })
      return
    }
    if (i == '') {
      wx.showToast({
        title: "请输入密码",
        icon: "error"
      })
      return
    }
    wx.showLoading({
      title: "添加中",
      mask: !0
    })
    t.request({
      url: a.data.url + "healthPunchIn/addSignInAccount",
      data: {
        username: n,
        password: i
      },
      success: function (t) {
        console.log(t), 201 == t.data.code ? (wx.hideLoading(), wx.showToast({
          title: "学号或密码错误",
          icon: "error"
        })) : 400 == t.data.code ? wx.showToast({
          title: "权限不足",
          icon: "error"
        }) : (a.setData({
          mine: t.data.mine,
          isAdding: ""
        }), a.hideModal(), wx.hideLoading(), wx.showToast({
          title: "添加成功",
          mask: !0
        }), setTimeout(function () {
          a.onLoad();
        }, 800));
      },
      fail: function (t) {
        a.setData({
          isAdding: ""
        }), console.log(t);
      }
    })

  },
  showModal: function (t) {
    this.setData({
      modalName: t.currentTarget.dataset.target
    });
  },
  hideModal: function (t) {
    this.setData({
      modalName: null
    });
  },
  hideModal1: function (t) {
    this.setData({
      modalName: null
    });
  },
  del: function (e) {
    if (t.userRegister()) {
      var a = this;
      wx.showModal({
        title: "删除账号",
        content: "是否删除此账号，该操作无法逆转。",
        success: function (e) {
          e.confirm && (wx.showLoading({
            title: "删除中",
            mask: !0
          }), console.log(e), t.request({
            url: a.data.url + "healthPunchIn/delSignInAccount",
            success: function (t) {
              console.log(t.data), 200 == t.data.code ? (wx.hideLoading(), wx.showToast({
                title: "删除成功",
                mask: !0
              })) : (wx.hideLoading(), wx.showToast({
                title: "删除失败",
                icon: "none"
              }));
            },
            fail: function (t) {
              console.log(t), wx.hideLoading(), wx.showToast({
                title: "删除失败",
                icon: "none"
              });
            },
            complete: function (t) {
              setTimeout(function () {
                a.onLoad(), a.hideModal();
              }, 800);
            }
          }));
        }
      });
    }
  },
  onShareAppMessage: function (t) {
    return {
      title: "川大IN",
      path: this.route
    };
  },
  initAlert: function (e) {
    var a = this;
    this.data.mine && 0 == this.data.mine.alert && new Promise(function (t, e) {
      wx.requestSubscribeMessage({
        tmplIds: ["ZiN2BLa6chJYtudnRz2rEHnGT412sDwkqhxaJLhJHjE"],
        success: function (e) {
          t(e);
        },
        fail: function (t) {
          e(t);
        }
      });
    }).then(function (e) {
      if ("accept" == e.ZiN2BLa6chJYtudnRz2rEHnGT412sDwkqhxaJLhJHjE) t.request({
        url: a.data.url + "/healthPunchIn/signInAlert",
        success: function (t) {
          a.setData({
            mine: t.data.mine
          });
        }
      });
      else {
        var n = a.data.mine;
        n.alert = 0, a.setData({
          mine: n
        });
      }
    }).catch(function (t) {
      console.log(t), wx.showToast({
        title: "我裂开了。",
        icon: "none"
      });
    });
    this.hideModal();
  }
});