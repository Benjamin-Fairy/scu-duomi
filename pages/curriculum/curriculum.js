var t = require("../../@babel/runtime/helpers/typeof"),
  e = getApp(),
  a = {
    huaxi: ["8:00-8:45", "8:55-9:40", "10:00-10:45", "10:55-11:40", "14:00-14:45", "14:55-15:40", "15:50-16:35", "16:55-17:40", "17:50-18:35", "19:30-20:15", "20:25-21:10", "21:20-22:05"],
    wangjiang: ["8:00-8:45", "8:55-9:40", "10:00-10:45", "10:55-11:40", "14:00-14:45", "14:55-15:40", "15:50-16:35", "16:55-17:40", "17:50-18:35", "19:30-20:15", "20:25-21:10", "21:20-22:05"],
    jiangan: ["8:15-9:00", "9:10-9:55", "10:15-11:00", "11:10-11:55", "13:50-14:35", "14:45-15:30", "15:40-16:25", "16:45-17:30", "17:40-18:25", "19:20-20:05", "20:15-21:00", "21:10-21:55"]
  };

Component({
  data: {
    url: "",
    jwurl: "",
    weekNow: 0,
    colorArray: ["#FF9769", "#C09586", "#f3b2a1", "#ab5705", "#0099CC", "#50BD8B", "#FF9999", "#0f5553", "#f95aa1", "#FFC174"],
    kclist: null,
    SectionAndTime: null,
    isgetting: !1,
    trigger: !1,
    callback: !1,
    date: "2018-12-25",
    systemInfo: null
  },
  lifetimes: {
    attached: function () {
      let _this = this
      wx.getSystemInfoAsync({
        success: (result) => {
          console.log(result)
          _this.setData({
            systemInfo: result
          })
        },
      })
      this.setData({
        url: e.globalData.url,
        jwurl: e.globalData.jwurl
      }), this.setData({
        date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
      });
      var t = "" == wx.getStorageSync("startDate") ? new Date("2021/8/30").getTime() : wx.getStorageSync("startDate");
      if (null != t && "" != t) {
        var i = new Date(),
          s = new Date(t),
          o = i.getTime() - s.getTime();
        if (o < 0) this.setData({
          weekNow: -1
        });
        else {
          var l = Math.floor(o / 1e3 / 60 / 60 / 24 / 7);
          l > 19 ? this.setData({
            weekNow: -1
          }) : this.setData({
            weekNow: l
          });
        }
      } else this.setData({
        weekNow: -1
      });
      var n = wx.getStorageSync("kclist");
      null != n && "" != n && this.setData({
        kclist: n
      });
      var r = wx.getStorageSync("campus");
      r = r || "wangjiang", this.setData({
        planTime: a[r]
      }), null != this.data.kclist && "" != this.data.kclist || !e.globalData.jwclogin || (this.getKCInfo(),
        null != this.data.kclist && "" != this.data.kclist || this.data.isgetting || (e.checkSCULogin(),
          this.setData({
            isgetting: !0
          }))), wx.setNavigationBarTitle({
            title: "课表"
          });
    },

  },
  methods: {
    PickerChange: function (t) {
      this.setData({
        weekNow: t.detail.value,
        index: t.detail.value
      });
    },
    refresh: function () {
      e.globalData.jwclogin ? this.getKCInfo() : (e.checkSCULogin(), this.setData({
        callback: !0
      }));
    },
    getKCInfo: function () {
      var a = this,
        i = this;
      console.log(i.data.jwurl), this.setData({
        isgetting: !0
      }), wx.showLoading({
        title: "获取数据中..."
      }), wx.request({
        url: i.data.jwurl + "/student/courseSelect/thisSemesterCurriculum/index",
        header: {
          cookie: e.globalData.JSESSIONID_SCU,
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (s) {
          var o = s.data,
            l = /student\/courseSelect\/thisSemesterCurriculum\/(.+?)\/ajaxStudentSchedule\/curr\/callback/.exec(o);
          console.log(l), wx.request({
            url: i.data.jwurl + l[0],
            header: {
              cookie: e.globalData.JSESSIONID_SCU,
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              sessionId: e.globalData.JSESSIONID
            },
            success: function (e) {
              console.log(e.data)
              wx.hideLoading()
              if (e.data.xkxx) {
                wx.showToast({
                  title: "获取成功！"
                })
                wx.setStorageSync("kclist", e.data.xkxx[0])
                a.setData({
                  isgetting: !0,
                  trigger: !1,
                  callback: !1,
                  kclist: e.data.xkxx[0]
                });
              }

            },
            fail: function (t) {
              console.log(t), a.setData({
                isgetting: !0,
                trigger: !1,
                callback: !1
              }), wx.hideLoading(), wx.showToast({
                title: "获取数据失败！"
              });
            }
          });
        },
        fail: function (t) {
          return console.log(t);
        }
      });
    },
    showModal: function (t) {
      var e = t.currentTarget.dataset.parentitem,
        a = t.currentTarget.dataset.item;
      console.log(Object.assign(e, a)), this.setData({
        modalName: t.currentTarget.dataset.target,
        kcdetail: Object.assign(e, a)
      });
    },
    showSelectWeek: function (t) {
      this.setData({
        modalName: t.currentTarget.dataset.target
      });
    },
    hideModal: function (t) {
      this.setData({
        modalName: null
      });
    },
    DateChange: function (t) {
      this.setData({
        date: t.detail.value
      });
    },
    confirm: function (t) {
      if (1 == new Date(this.data.date.replace("-", "/").replace("-", "/")).getDay()) {
        wx.setStorageSync("startDate", this.data.date.replace("-", "/").replace("-", "/"));
        var e = new Date(),
          a = new Date(this.data.date.replace("-", "/").replace("-", "/")),
          i = e.getTime() - a.getTime();
        if (i < 0) this.setData({
          weekNow: -1
        });
        else {
          var s = Math.floor(i / 1e3 / 60 / 60 / 24 / 7);
          s > 19 ? this.setData({
            weekNow: -1
          }) : this.setData({
            weekNow: s
          });
        }
        wx.showToast({
          title: "修改成功"
        }), this.hideModal();
      } else wx.showToast({
        title: "这天好像不是星期一哦",
        icon: "none"
      });
    },
    addWeek: function () {
      wx.vibrateShort(), this.data.weekNow < 21 && this.setData({
        weekNow: this.data.weekNow + 1
      });
      console.log(this.data.weekNow)
    },
    subWeek: function () {
      wx.vibrateShort(), this.data.weekNow > -1 && this.setData({
        weekNow: this.data.weekNow - 1
      });
    },
  }

});