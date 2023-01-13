var a = getApp();

Page({
  data: {
    multiIndex: [0, 0],
    multiArray: [
      ["江安", "望江", "华西"],
      ["一教A座", "一教B座", "一教C座", "一教D座", "综合楼B座", "综合楼C座", "文科楼一区", "文科楼二区", "文科楼三区"]
    ],
    wj: ["东二教", "东三教", "基教楼A座", "基教楼C座", "研究生院"],
    hx: ["九教", "十教"],
    ja: ["一教A座", "一教B座", "一教C座", "一教D座", "综合楼B座", "综合楼C座", "文科楼一区", "文科楼二区", "文科楼三区"],
    hx_: ["HX9", "HX10"],
    wj_: ["WJdong2", "WJdong3", "WJjijiaoA", "WJjijiaoC", "WJyjs"],
    ja_: ["yjA", "yjB", "yjC", "yjD", "zongB", "zongC", "wen1", "wen2", "wen3"]
  },
  onLoad: function () {
    var t = this;
    this.setData({
      multiIndex: "" == wx.getStorageSync("multiIndex") ? [0, 0] : wx.getStorageSync("multiIndex"),
      url: a.globalData.url
    }), "" != wx.getStorageSync("roomdata") && this.setData({
      roomdata: wx.getStorageSync("roomdata")
    });
    var o = "";
    0 == this.data.multiIndex[0] ? (o = this.data.ja_[this.data.multiIndex[1]], this.setData({
      multiArray: [this.data.multiArray[0], this.data.ja]
    })) : 1 == this.data.multiIndex[0] ? (o = this.data.wj_[this.data.multiIndex[1]],
      this.setData({
        multiArray: [this.data.multiArray[0], this.data.wj]
      })) : (o = this.data.hx_[this.data.multiIndex[1]], this.setData({
      multiArray: [this.data.multiArray[0], this.data.hx]
    }))
    wx.setStorageSync("multiIndex", this.data.multiIndex)
    wx.showLoading({
      title: "获取数据中..."
    })
    wx.request({
      url: this.data.url + "classroom/jxldata",
      data: {
        jxlname: o
      },
      success: function (a) {
        console.log(a)
        wx.hideLoading();
        wx.setStorageSync("roomdata", o)
        let date = new Date(a.data.data.servertime)
        let updateTime =  date.getHours() + ":" + (date.getMinutes() < 10 ? (date.getMinutes() + '0') : (date.getMinutes()))
        t.setData({
          roomdata: a.data.data.roomdata,
          updateTime: updateTime
        })
      }
    }), wx.showLoading({
      title: "获取数据中..."
    }), wx.request({
      url: this.data.url + "classroom/jxlconfig",
      success: function (a) {
        for (var o = a.data.data, s = [], i = [], e = [], d = [], r = [], l = [], n = 0; n < o.length; n++) "01" == o[n].xqh ? (i.push(o[n].name),
          r.push(o[n].location)) : "02" == o[n].xqh ? (e.push(o[n].name), l.push(o[n].location)) : (s.push(o[n].name),
          d.push(o[n].location));
        t.setData({
          ja: s,
          ja_: d,
          hx: e,
          hx_: l,
          wj: i,
          wj_: r
        }), wx.hideLoading();
      },
      fail: function (a) {
        console.log(a);
      }
    });
  },
  onShow: function () {
    this.onLoad();
  },
  refresh: function () {
    wx.navigateTo({
      url: "/pages/home/Classroom/vpnlogin/vpnlogin"
    });
  },
  MultiColumnChange: function (a) {
    var t = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    switch (t.multiIndex[a.detail.column] = a.detail.value, a.detail.column) {
      case 0:
        switch (t.multiIndex[0]) {
          case 0:
            t.multiArray[1] = this.data.ja;
            break;

          case 1:
            t.multiArray[1] = this.data.wj;
            break;

          case 2:
            t.multiArray[1] = this.data.hx;
        }
    }
    this.setData(t);
  },
  MultiChange: function (a) {
    var t = this,
      o = a.detail.value,
      s = "";
    s = 0 == o[0] ? this.data.ja_[o[1]] : 1 == o[0] ? this.data.wj_[o[1]] : this.data.hx_[o[1]],
      wx.setStorageSync("multiIndex", o), wx.showLoading({
        title: "获取数据中..."
      }), wx.request({
        url: this.data.url + "classroom/jxldata",
        data: {
          jxlname: s
        },
        success: function (a) {
          console.log(a.data);
          var o = a.data.data.roomdata;
          console.log(o), wx.setStorageSync("roomdata", o), t.setData({
            roomdata: o
          }), wx.hideLoading(), wx.showToast({
            title: "获取成功！"
          });
        }
      });
  },
  showModal: function (a) {
    var t = a.currentTarget.dataset.row,
      o = a.currentTarget.dataset.column,
      s = this.data.roomdata[t].classUse[o],
      i = this.data.multiArray[0][this.data.multiIndex[0]] + this.data.multiArray[1][this.data.multiIndex[1]] + this.data.roomdata[t].roomName;
    console.log(this.data.roomdata[t].classUse[o]), this.setData({
      modalName: a.currentTarget.dataset.target
    }), this.setData({
      ClassRoomDetail: {
        className: i,
        kcm: null == s.kcm ? "空闲" : s.kcm,
        roomRtNum: null == this.data.roomdata[t].roomRtNum ? "0" : this.data.roomdata[t].roomRtNum,
        roomZws: this.data.roomdata[t].roomZws,
        jc: 0 == o ? "第一大节" : 1 == o ? "第二大节" : 2 == o ? "第三大节" : 3 == o ? "第四大节" : "第五大节",
        jsm: s.jsm ? s.jsm : "无"
      }
    });
  },
  hideModal: function (a) {
    this.setData({
      modalName: null
    });
  },
  onShareAppMessage: function (a) {
    return {
      title: "",
      path: this.route
    };
  }
});