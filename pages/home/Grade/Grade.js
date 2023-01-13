var e = getApp();

Page({
  data: {
    url: "",
    score: {},
    rank: {},
    num: 0,
    checked: "",
    km: 0,
    avgcj: 0,
    avgjd: 0,
    credit: 0,
    detail: {},
    modalName: ""
  },
  onLoad: function (t) {
    this.setData({
      score: wx.getStorageSync("score"),
      rank: wx.getStorageSync("rank"),
      modalName: wx.getStorageSync("gradeTongyi") ? "" : "xieyi",
      url: e.globalData.url,
      jwurl: e.globalData.jwurl
    })
    if (e.globalData.jwclogin == false) {
      e.checkSCULogin()
      this.setData({
        flag: true
      })
    }
  },
  onShow: function () {
    if (false == e.globalData.jwclogin) {
      console.log(123213)
      e.checkSCULogin()
      this.setData({
        flag: true
      })
      return
    }
    if (this.data.flag && !this.data.score) {
      console.log(232323)
      wx.showLoading({
        title: "获取数据中..."
      })
      this.getScore(this.data.flag)
    }
  },
  refresh: function () {
    wx.showNavigationBarLoading();
    0 == e.globalData.jwclogin ? e.checkSCULogin() : (this.setData({
      trigger: !0
    }), wx.showLoading({
      title: "获取数据中..."
    }), this.getScore(!0));
  },
  getScore: function (t) {
    var a = this;
    let updateTime = wx.getStorageSync('scoreUpdateTime')
    if (!updateTime || (new Date().getTime() - parseInt(updateTime)) / 1000 > 2 * 24 * 60 * 60) {
      wx.setStorage({
        data: new Date().getTime(),
        key: "scoreUpdateTime"
      })
      //超过两天则使用后台更新
      wx.request({
        url: a.data.url + "scu/getScore",
        data: {
          sessionId: e.globalData.JSESSIONID
        },
        complete: function (e) {
          callback(e)
        },
        faile: function (e) {
          wx.hideLoading(), wx.showToast({
            title: "出错了",
            icon: "none"
          }), console.log(e);
        }
      });
    } else {
      //否则直接通过教务处api更新
      wx.request({
        url: e.globalData.jwurl + 'student/integratedQuery/scoreQuery/allPassingScores/index',
        header: {
          cookie: e.globalData.JSESSIONID_SCU
        },
        success: function (res) {
          let urls = /scoreQuery\/(.+?)\/allPassingScores\/callback/.exec(res.data)
          wx.request({
            url: e.globalData.jwurl + "student/integratedQuery/scoreQuery/" + urls[1] + "/allPassingScores/callback",
            header: {
              cookie: e.globalData.JSESSIONID_SCU
            },
            success: (res) => {
              callback(res)
            }
          })
        }
      });
    }

    function callback(e) {
      console.log(e)
      t && (wx.hideLoading(), wx.showToast({
        title: "获取成功！"
      }), wx.hideNavigationBarLoading(), a.setData({
        trigger: !1
      })), e.data.lnList.reverse();
      for (var o = e.data.lnList, c = 0; c < o.length; c++) {
        for (var i = 0, r = 0, s = 0, n = 0, d = 0, l = 0, g = 0; g < o[c].cjList.length; g++) "必修" == o[c].cjList[g].courseAttributeName ? (i += parseFloat(o[c].cjList[g].cj * o[c].cjList[g].credit),
          r += parseFloat(o[c].cjList[g].credit), d += parseFloat(o[c].cjList[g].gradePointScore * o[c].cjList[g].credit)) : (s += parseFloat(o[c].cjList[g].cj * o[c].cjList[g].credit),
          n += parseFloat(o[c].cjList[g].credit), l += parseFloat(o[c].cjList[g].gradePointScore * o[c].cjList[g].credit));
        o[c].bxcj = i, o[c].bxxf = r, o[c].xxcj = s, o[c].xxxf = n, o[c].xxjd = l, o[c].bxjd = d;
      }
      wx.setStorage({
        data: o,
        key: "score"
      })
      a.setData({
        score: o
      });
    }

  },
  action: function (e) {
    var t = this,
      a = wx.createSelectorQuery(),
      o = this;
    if (this.setData({
        num: e.currentTarget.dataset.num
      }), "nec" == e.currentTarget.id) a.selectAll(".tr").boundingClientRect(function (e) {
      for (var t = o.data.checked, a = 0; a < e.length; a++) "必修" == e[a].dataset.courseattributename && -1 == t.indexOf(e[a].dataset.coursename) && (t += e[a].dataset.coursename);
      o.setData({
        checked: t
      });
    }).exec();
    else if ("del" == e.currentTarget.id) this.setData({
      checked: ""
    });
    else if ("cal" == e.currentTarget.id) {
      var c = 0,
        i = 0,
        r = 0,
        s = 0;
      a.selectAll(".checked").boundingClientRect(function (e) {
        for (var t = 0; t < e.length; t++) c += parseFloat(e[t].dataset.credit), s += parseFloat(e[t].dataset.credit) * parseFloat(e[t].dataset.cj),
          r += parseFloat(e[t].dataset.credit) * parseFloat(e[t].dataset.gradepointscore),
          i++;
        o.setData({
          km: i,
          avgcj: (s / c).toFixed(2),
          avgjd: (r / c).toFixed(2),
          credit: c
        });
      }).exec(), o.setData({
        modalName: e.currentTarget.dataset.target
      });
    } else {
      // o.setData({
      //   modalName: e.currentTarget.dataset.target
      // })
      wx.showToast({
        title: '功能已被教务处封！',
        icon: 'none'
      })
    };
    setTimeout(function () {
      t.setData({
        num: 0
      });
    }, 500);
  },
  Focus: function (e) {
    -1 == this.data.checked.indexOf(e.currentTarget.dataset.coursename) ? this.setData({
      checked: this.data.checked + e.currentTarget.dataset.coursename
    }) : this.setData({
      checked: this.data.checked.replace(e.currentTarget.dataset.coursename, "")
    });
  },
  hideModal: function (e) {
    this.setData({
      modalName: null
    });
  },
  confirm: function (t) {
    var a = this;
    0 == e.globalData.jwclogin ? e.checkSCULogin() : (wx.showLoading({
      title: "获取数据中..."
    }), wx.request({
      url: a.data.jwurl + "/student/integratedQuery/scoreQuery/thisTermScores/index",
      header: {
        cookie: e.globalData.JSESSIONID_SCU
      },
      success: function (t) {
        var o = t.data,
          c = /scoreQuery\/(.+?)\/thisTermScores\/data/.exec(o);
        wx.request({
          url: a.data.jwurl + "/student/integratedQuery/scoreQuery/" + c[1] + "/thisTermScores/data",
          header: {
            cookie: e.globalData.JSESSIONID_SCU
          },
          complete: function (e) {
            console.log(e), wx.hideLoading(), wx.showToast({
              title: "获取成功！"
            }), wx.setStorage({
              data: e.data,
              key: "rank"
            }), a.setData({
              rank: e.data
            });
          },
          faile: function (e) {
            wx.hideLoading(), wx.showToast({
              title: "出错了",
              icon: "none"
            }), console.log(e);
          }
        });
      }
    })), this.setData({
      modalName: "rank"
    });
  },
  getDetail: function (t) {
    var a = this;
    wx.showLoading({
      title: "加载中"
    });
    var o = t.currentTarget.dataset.item,
      c = "zxjxjhh=" + o.id.executiveEducationPlanNumber + "&kch=" + o.id.courseNumber + "&kxh=" + o.id.coureSequenceNumber + "&kssj=" + o.examTime + "&param=" + parseInt(o.scoreEntryModeCode);
    console.log(o), wx.request({
      url: "https://scujw.chenyipeng.com/scujw/getScoreDetail?" + c,
      method: "POST",
      header: {
        cookie: e.globalData.JSESSIONID_SCU
      },
      data: {
        zxjxjhh: o.id.executiveEducationPlanNumber,
        kch: o.id.courseNumber,
        kxh: o.id.coureSequenceNumber,
        kssj: o.examTime,
        param: "001"
      },
      success: function (e) {
        var t;
        console.log(e.data), t = "当前不允许查看分项成绩！" == e.data.msg ? "当前不允许查看分项成绩！" : {
          detail: e.data.scoreDetailList,
          xf: o.credit,
          cj: o.courseScore,
          jd: o.gradePointScore,
          kcmc: o.courseName
        }, wx.hideLoading(), a.setData({
          modalName: "detail",
          detail: t
        });
      },
      fail: function (e) {
        console.log(e), wx.hideLoading(), wx.showToast({
          title: "获取失败",
          icon: "none"
        });
      }
    });
  },
  tongyi: function () {
    wx.setStorageSync("gradeTongyi", !0), this.hideModal();
  },
  butongyi: function () {
    wx.switchTab({
      url: "/pages/home/home/home"
    });
  }

});