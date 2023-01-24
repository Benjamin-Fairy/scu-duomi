var e = getApp(),
  a = 0,
  t = 0;
Component({
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
  lifetimes: {
    attached: function (a) {
      let _this = this
      this.setData({
        url: e.globalData.url
      })
      if (!e.globalData.user) {
        e.loginReadyCallBack = function (res) {
          console.log(res)
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
        console.log(222)
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
  },

  methods: {
    navigate: function (e) {
      var a = e.currentTarget.dataset.url;
      a && wx.navigateTo({
        url: a
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
              success: (res) => { },
            })
            wx.openEmbeddedMiniProgram({
              appId: 'wx2f80896fbecfdaa6',
              path:'/pages/me/index/index',
              extraData: {
                jscode: res.code
              },
            })
          }
        })
      } else {
        wx.openEmbeddedMiniProgram({
          appId: 'wx2f80896fbecfdaa6',
          path:'/pages/square/index/index'
        })
      }
    },
    hideModal: function () {
      this.setData({
        modalName: ""
      });
    }
  }
});