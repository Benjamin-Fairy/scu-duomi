var t = getApp();

Page({
  data: {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0
  },
  onLoad: function (a) {
    var s = this;
    s.setData({
      url: t.globalData.url
    })
    
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    t.request({
      url: s.data.url + "classroom/captcha",
      success: function (t) {
        wx.hideLoading()
        console.log(t), 201 == t.data.code && wx.showModal({
          title: "提示",
          content: t.data.msg,
          showCancel: !1,
          success: function (t) {
            t.confirm && wx.navigateBack({
              delta: 1
            });
          }
        }), s.setData({
          data: t.data
        });
      }
    });

  },
  move: function (t) {
    this.setData({
      x: t.touches[0].pageX,
      y: t.touches[0].pageY
    });
  },
  movestart: function (t) {
    this.setData({
      startX: t.touches[0].pageX,
      startY: t.touches[0].pageY
    });
  },
  moveend: function () {
    var a = this;
    console.log(parseInt(parseInt(a.data.x) - parseInt(a.data.startX)));
    wx.showLoading({
      title: '操作中',
      mask: true
    })
    var s = "w=" + parseInt(parseInt(a.data.x) - parseInt(a.data.startX)) + "&t=0&locations[0][x]=" + parseInt(a.data.startX) + "&locations[0][y]=" + parseInt(a.data.startY) + "&locations[1][x]=" + parseInt(a.data.x) + "&locations[1][y]=" + parseInt(a.data.y);
    t.request({
      url: a.data.url + "classroom/distance",
      method: "post",
      data: s,
      success: function (t) {
        wx.hideLoading()
        0 == t.data.success ? wx.showModal({
          title: "提示",
          content: "验证失败。",
          showCancel: !1,
          success: function (t) {
            t.confirm && (a.setData({
              x: 0,
              y: 0,
              startX: 0,
              startY: 0
            }), a.onLoad());
          }
        }) : wx.showModal({
          title: "提示",
          content: "验证成功。",
          showCancel: !1,
          success: function (t) {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      }
    });
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
});