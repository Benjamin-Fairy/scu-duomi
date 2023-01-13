var e = getApp(),
  a = 0,
  t = 0;

Page({
  cardCur: 0,
  data: {
    modalName: "",
    swiperList: [{
      id: 0,
      type: "image",
      url: "https://api.ixiaowai.cn/gqapi/gqapi.php?timestamp=1",
      target: ""
    }, {
      id: 1,
      type: "image",
      url: "https://api.ixiaowai.cn/gqapi/gqapi.php?timestamp=2",
      target: ""
    }, {
      id: 1,
      type: "image",
      url: "https://api.ixiaowai.cn/gqapi/gqapi.php?timestamp=3",
      target: ""
    }],
    url: "",
    elements: [{
        title: "成绩查询",
        name: "Grade",
        color: "cyan",
        icon: "cuIcon-medal",
        url: "/pages/home/Grade/Grade"
      }, {
        title: "教室查询",
        name: "Classroom",
        color: "orange",
        icon: "cuIcon-home",
        url: "/pages/home/Classroom/Classroom"
      }, {
        title: "寻课",
        name: "GoodClass",
        color: "olive",
        icon: "cuIcon-creative",
        url: "/pages/home/GoodClass/GoodClass"
      },
      // {
      //   title: "asd",
      //   name: "CourseEvaluation",
      //   color: "pink",
      //   icon: "cuIcon-magic",
      //   url: "/pages/register/register"
      // },
      {
        title: "快捷评教",
        name: "CourseEvaluation",
        color: "pink",
        icon: "cuIcon-magic",
        url: "/pages/home/courseEvaluation/courseEvaluation"
      },
      {
        title: "青年大学习",
        name: "QNDXX",
        color: "mauve",
        icon: "cuIcon-explorefill",
        url: "/pages/plugin/QNDXX/qndxx"
      },
      //  {
      //   title: "健康打卡",
      //   name: "HPI",
      //   color: "blue",
      //   icon: "cuIcon-like",
      //   url: "/pages/plugin/HPI/HPI"
      // },
      {
        title: "社区论坛",
        name: "Community",
        color: "brown",
        icon: "cuIcon-hot",
        // url: '/pages/plugin/au/au',
        type: 1
      },
      // {
      //   title: "抢课",
      //   name: "CourseSelection",
      //   color: "green",
      //   icon: "cuIcon-discover",
      //   url: "/pages/plugin/qiangke/qiangke"
      // },
      {
        title: "选择困难症",
        name: "Allodoxaphobia",
        color: "purple",
        icon: "cuIcon-crown",
        url: "/pages/plugin/chooseForMe/ChooseForMe"
      }
    ],
    now: new Date().getMonth() + 1 + "月" + new Date().getDate() + "日",
    readCheck: !1,
    readDone: !1,
    isShow: !0,
    user: null
  },
  open: function () {
    this.setData({
      show: !0
    });
  },
  copy() {
    if (!e.globalData.ticket) {
      wx.showToast({
        title: '你尚未注册或正在登录，请完成登陆后点击。',
        icon: 'none'
      })
      e.userRegister(null, false)
      return
    }
    if (!e.globalData.user.openidIn) {
      wx.showLoading({
        title: '稍等',
      })
      wx.login({
        success: res => {
          wx.hideLoading({
            success: (res) => {},
          })
          wx.navigateToMiniProgram({
            appId: 'wx2f80896fbecfdaa6',
            path: '/pages/me/index/index',
            extraData: {
              jscode: res.code
            },
            envVersion: 'trial',
            success: res => {
              console.log(res)

            }
          })
        }
      })
    } else {
      wx.navigateToMiniProgram({
        appId: 'wx2f80896fbecfdaa6',
        path: '/pages/me/index/index',
        envVersion: 'trial',
        success: res => {
          console.log(res)
        }
      })
    }
  },
  hidefun: function (o) {
    var i = new Date().getTime();
    if (i - a < 300 || 0 == a ? t++ : t = 0, a = i, 10 == t) {
      wx.vibrateLong(), t = 0;
      var n = this.data.elements;
      n.push({
        title: "健康打卡",
        name: "HPI",
        color: "blue",
        icon: "cuIcon-likefill",
        url: "/pages/home/HPI/HPI"
      }), this.setData({
        elements: n
      }), e.globalData.user && (e.globalData.user.donateCount = 1);
    }
  },
  onHide: function () {
    this.setData({
      isShow: !1
    });
  },
  readCheck: function (e) {
    0 == e.detail.value.length ? this.setData({
      readCheck: 0
    }) : this.setData({
      readCheck: 1
    });
  },
  onLoad: function (a) {
    let _this = this
    this.setData({
      url: e.globalData.url
    }), wx.createSelectorQuery().select("#xieyi-scroll").node().exec(function (e) {
      e[0].node.showScrollbar = !0;
    });
    if (!e.globalData.user) {
      e.loginReadyCallBack = function (res) {
        if (res.data.user.role > 8) {
          let list = _this.data.elements
          list.push({
            title: "健康打卡",
            name: "HPI",
            color: "blue",
            icon: "cuIcon-like",
            url: "/pages/plugin/HPI/HPI"
          })
          _this.setData({
            elements: list
          })
        }
      }
    } else {
      if (e.globalData.user && e.globalData.user.role > 8) {
        let list = _this.data.elements
        list.push({
          title: "健康打卡",
          name: "HPI",
          color: "blue",
          icon: "cuIcon-like",
          url: "/pages/plugin/HPI/HPI"
        })
        _this.setData({
          elements: list
        })
      }
    }

  },
  scroll: function (e) {
    e.detail.scrollHeight - 500 < e.detail.scrollTop && (this.setData({
      readDone: !0
    }), console.log("阅读完成"));
  },
  onShow: function () {
    var e = this;
    e.setData({
      isShow: !0
    }), wx.request({
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
  navigate: function (e) {
    var a = e.currentTarget.dataset.url;
    a && wx.navigateTo({
      url: a
    });
  },
  onShareAppMessage: function (e) {
    return {
      title: "",
      path: this.route
    };
  },
  hideModal: function () {
    this.setData({
      modalName: ""
    });
  }
});