var n = getApp();

Page({
  data: {
    list: [],
    checkList: [],
    modalName: "modal1",
    jwurl: ''
  },
  onLoad: function () {
    this.setData({
      jwurl: n.globalData.jwurl
    })
  },
  onShow: function () {
    0 == n.globalData.jwclogin ? n.checkSCULogin() : this.init();
  },
  hideModal: function (n) {
    this.setData({
      modalName: null
    });
  },
  init: function () {
    var t = this;
    wx.showLoading({
      title: "加载中"
    })
    wx.request({
      url: t.data.jwurl + "student/teachingAssessment/evaluation/queryAll",
      header: {
        cookie: n.globalData.JSESSIONID_SCU,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      method: "POST",
      data: {
        flag: "kt",
        pageNum: 1,
        pageSize: 50
      },
      success: function (n) {
        t.setData({
          list: n.data.data.records ? n.data.data.records : []
        })
        console.log(n)
        console.log(t.data.list);
      },
      fail: function (n) {
        return console.log(n);
      },
      complete: function (n) {
        return wx.hideLoading();
      }
    });
  },
  evalAll: function (n, t) {
    var o = this,
      a = o.data.checkList;
    a.length > 0 && (wx.showLoading({
      title: "正在评价" + a[0].KCM,
      mask: !0
    }), o.singalEva(a[0].KTID, function () {
      a.splice(0, 1), o.setData({
        checkList: a
      }), o.evalAll({}, !0);
    })), 0 == a.length && (t ? (wx.showToast({
      title: "评价完成"
    }), setTimeout(function () {
      o.onLoad(), o.onShow();
    }, 600)) : wx.showToast({
      title: "没有选择课程",
      icon: "error"
    }));
  },
  courseCheck: function (n) {
    for (var t = n.currentTarget.dataset.item, o = this.data.checkList, a = !1, e = 0; e < o.length; e++)
      if (o && o[e].KTID == t.KTID) {
        o.splice(e, 1), a = !0;
        break;
      }
    a || o.push(t), this.setData({
      checkList: o
    }), console.log(this.data.checkList);
  },
  singalEva: function (t, o) {
    var a = this;
    wx.request({
      url: a.data.jwurl + "student/teachingEvaluation/newEvaluation/evaluation/" + t,
      header: {
        cookie: n.globalData.JSESSIONID_SCU
      },
      success: function (t) {
        var e = t.data,
          i = e.match(/[A-Z0-9]{32}/g),
          r = e.match(/[a-z0-9]{32}/g),
          s = a.handleData(i);
        console.log(s), wx.request({
          url: a.data.jwurl + "student/teachingAssessment/baseInformation/questionsAdd/doSave?tokenValue=" + r,
          method: "post",
          header: {
            "content-type": "multipart/form-data; boundary=WebKitFormBoundary1coTJRQNejeZlLDM",
            cookie: n.globalData.JSESSIONID_SCU
          },
          data: s,
          success: function (n) {
            console.log(n), o();
          },
          fail: function (n) {
            return console.log(n);
          }
        });
      }
    });
  },
  handleData: function (n) {
    var t = ["B_课堂上开展了有效的研讨互动教学", "C_课程进度安排合理，详略得当", "D_课程内容具有前沿性和时代性", "E_任课老师肯花时间课外跟学生交流", "F_任课老师鼓励学生独立思考，注重培养学生创新精神", "G_提供了丰富且有效的教学资料", "H_课程考核方式合理", "I_课程具有挑战性", "J_任课老师就实验操作或实践活动的规范性及安全性做了细致要求"],
      o = ["非常好，讲课清晰", "很棒的老师，学到了很多东西", "老师讲课清晰，考核合理", "老师上课讲课清晰", "很好"],
      a = "WebKitFormBoundary1coTJRQNejeZlLDM",
      e = "";
    e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="wjbm"\r\n\r\n' + n[0],
      e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="ktid"\r\n\r\n' + n[1],
      e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="' + n[2] + '"\r\n\r\n100',
      e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="' + n[3] + '"\r\n\r\nA_完全符合',
      e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="' + n[8] + '"\r\n\r\nA_完全同意',
      e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="' + n[13] + '"\r\n\r\nA_完全同意',
      e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="' + n[18] + '"\r\n\r\nA_老师通过综合教务发布了问卷调查并及时改进教学',
      e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="' + n[22] + '"\r\n\r\nA_任课老师讲课生动';
    for (var i = 0; i < t.length; i++) Math.random() > .66 && (e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="' + n[22] + '"\r\n\r\n' + t[i]);
    return e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="' + n[33] + '"\r\n\r\nA_必须是',
      e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="' + n[37] + '"\r\n\r\n' + o[Math.floor(Math.random() * o.length)],
      e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="compare"\r\n\r\n',
      (e += "\r\n--" + a + '\r\nContent-Disposition: form-data; name="compare"\r\n\r\n') + "\r\n--" + a + "--";
  },
  sdEval: function (n) {
    var t = n.currentTarget.dataset.ktid;
    this.singalEva(t);
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
});