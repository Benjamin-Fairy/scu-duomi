var t = require("../../../@babel/runtime/helpers/interopRequireWildcard"),
  a = require("../../../@babel/runtime/helpers/defineProperty"),
  echarts = t(require("../../../ec-canvas/echarts")),
  s = getApp(),
  i = 1;
const app = getApp()
var showId;
Page({
  data: {
    url: "",
    cdnurl: "",
    end: !1,
    isGetting: !1,
    list: [],
    show: !1,
    EvaContent: "",
    anonymous: 0,
    modalName: "",
    star: 9,
    range: ["课程名", "教师名"],
    tjIndex: 0,
    searchValue: "",
    user: app.globalData.user,
    showbtn: new Date().getTime() > 1663830764844,
    pj: false
  },
  search: function (t) {
    wx.showLoading({
      title: "加载中",
      mask: !0
    }), this.setData({
      list: [],
      end: !1
    });
    i = 1;
    var e = 0 == this.data.tjIndex ? {
      kname: this.data.searchValue,
      page: i
    } : {
        tname: this.data.searchValue,
        page: i
      };
    if ("" != this.data.searchValue.trim()) {
      this.searchGet(e)
    } else {
      this.init();
    }
  },
  searchGet: function (t) {
    var e = this;
    e.data.end || (e.setData({
      isGetting: !0
    }), wx.request({
      url: e.data.url + "scu/score/search",
      data: t,
      success: function (t) {
        console.log(t), (!t.data.list || t.data.list.length < 15) && e.setData({
          end: !0
        }), e.setData(a({}, "list[" + (i - 1) + "]", t.data.list)), i++;
      },
      complete: function () {
        wx.hideLoading(), e.setData({
          isGetting: !1
        });
      }
    }));
  },
  tjChange: function (t) {
    this.setData({
      tjIndex: t.detail.value
    });
  },
  onUnload: function () {
    i = 1;
  },
  star: function (t) {
    this.setData({
      star: t.currentTarget.dataset.index
    });
  },
  onLoad: function (t) {
    console.log(new Date().getTime() + 1000 * 5 * 60 * 60)
    this.setData({
      url: s.globalData.url,
      user: s.globalData.user
    }), this.init();
  },
  onReady: function () {
    this.ecComponent = this.selectComponent("#mychart-dom-bar");
    this.zxEc = this.selectComponent("#zx-chart");
  },
  toDetail: function (t) {

    this.setData({
      show: !0
    })
    showId = t.currentTarget.dataset.kid
    this.getDetail(t.currentTarget.dataset.kid);
  },
  eval: function () {
    wx.showLoading({
      title: "评论中",
      mask: !0
    });
    var t = this,
      a = t.data.EvaContent;
    if ("" != a.trim()) {
      var e = t.data.anonymous,
        s = t.data.star,
        i = t.data.mainItem.kid;
      app.request({
        url: t.data.url + "insert/score/comment",
        data: {
          content: a,
          rank: s,
          anonymous: e,
          kid: i
        },
        success: function () {
          wx.showToast({
            title: "评论成功"
          })
          t.getCommentList(i), t.hideModal();
        },
        complete: function () {
          return wx.hideLoading();
        }
      });
    } else wx.showToast({
      title: "请输入内容",
      icon: "error"
    });
  },
  getCommentList(kid) {
    let _this = this
    s.request({
      url: _this.data.url + "scu/score/getClassCommentList?kid=" + kid,
      success: res => {
        _this.setData({
          commentList: res.data.data
        })
      }
    })
  },
  closeShade: function () {
    this.setData({
      show: !1
    }), wx.setNavigationBarTitle({
      title: "寻课"
    });
  },
  init: function () {
    var t = this;
    t.data.end || (t.setData({
      isGetting: !0
    }), wx.request({
      url: t.data.url + "scu/score/getClassList",
      data: {
        page: i
      },
      success: function (e) {
        console.log(e), (!e.data.data || e.data.data.length < 15) && t.setData({
          end: !0
        }), t.setData(a({}, "list[" + (i - 1) + "]", e.data.data)), i++;
      },
      complete: function (a) {
        t.setData({
          isGetting: !1
        }), wx.hideLoading();
      }
    }));
  },
  onReachBottom: function () {
    if ("" != this.data.searchValue.trim()) {
      var t = 0 == this.data.tjIndex ? {
        kname: this.data.searchValue,
        page: i
      } : {
          tname: this.data.searchValue,
          page: i
        };
      this.searchGet(t);
    } else this.init();
  },
  getBTOption(t) {
    return {
      legend: {
        x: "center",
        y: "bottom",
        itemWidth: 12,
        itemHeight: 8,
        data: ["0-59", "60-69", "70-79", "80-89", "90-100"],
        textStyle: {
          fontSize: 10
        }
      },
      color: ["black", "#6CACFF", "#FDEB82", "#6DE195", "#E16E93"],
      series: [{
        label: {
          normal: {
            formatter: "{d}%",
            fontSize: 12
          }
        },
        labelLine: {
          show: !0,
          normal: {
            smooth: .6
          }
        },
        center: ["50%", "50%"],
        data: [{
          name: "0-59",
          value: t.data.data.e
        }, {
          name: "60-69",
          value: t.data.data.d
        }, {
          name: "70-79",
          value: t.data.data.c
        }, {
          name: "80-89",
          value: t.data.data.b
        }, {
          name: "90-100",
          value: t.data.data.a
        }],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowOffsetX: 0
          }
        },
        radius: "55%",
        type: "pie"
      }],
      tooltip: {
        formatter: "{b}分的人数为{c},占比{d}%",
        trigger: "item"
      }
    };
  },
  getDetail: function (t) {
    var a = this;
    let kid = t
    wx.showLoading({
      title: "加载中",
      mask: !0
    }), wx.request({
      url: a.data.url + "scu/score/getDetail",
      data: {
        kid: t
      },
      success: function (t) {
        console.log(t)
        a.setData({
          mainItem: t.data.data
        })
        wx.setNavigationBarTitle({
          title: t.data.data.kname
        })

        // 饼图初始化
        a.ecComponent.init((canvas, width, height, dpr) => {
          // 在这里初始化图表
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr // new
          });
          chart.setOption(a.getBTOption(t));
          return chart;
        });
        // 折线图初始化
        a.zxEc.init((canvas, width, height, dpr) => {
          // 在这里初始化图表
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr // new
          });

          let list = t.data.data.history
          console.log(list)
          let pjList = new Array(list.length)
          let datelist = new Array(list.length)
          let maxList = new Array(list.length)
          let minList = new Array(list.length)

          for (let i = 0; i < list.length; i++) {
            datelist[i] = list[i].examTime
            pjList[i] = list[i].avg.toFixed(2)
            maxList[i] = list[i].max
            minList[i] = list[i].min
          }
          var option = {
            legend: {
              data: ['平均分', '最高分', '最低分'],
              top: 30,
              left: 'center',
              z: 100,
              selected: {
                '平均分': true,
                '最高分': false,
                '最低分': false
              }
            },
            grid: {
              containLabel: true
            },
            tooltip: {
              show: true,
              trigger: 'axis',
              formatter: (params) => {
                console.log(params)
                let index = params[0].dataIndex
                let count = a.data.mainItem.history[index].count
                let d = ''
                for (let i = 0; i < params.length; i++) {
                  d += params[i].seriesName + "：" + params[i].data + "\n"
                }
                d = d.substring(0, d.length - 1)
                if (d != '') {
                  d = '\n' + d
                }
                console.log(d)
                return params[0].axisValue + '\n统计自' + count + "人" + d
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: datelist,
            },
            yAxis: {
              x: 'center',
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            series: [{
              name: '平均分',
              type: 'line',
              smooth: true,
              data: pjList,
            }, {
              name: '最高分',
              type: 'line',
              smooth: true,
              data: maxList,
            }, {
              name: '最低分',
              type: 'line',
              smooth: true,
              data: minList,
            },]
          }
          console.log(pjList)
          chart.setOption(option);
          return chart;
        });

        a.getCommentList(kid)
      },
      complete: function () {
        return wx.hideLoading();
      }
    });
  },
  close: function () {
    this.setData({
      showActionsheet: !1
    });
  },
  del: function (t) {
    console.log(t);
    var a = t.currentTarget.dataset.item.sid,
      e = this;
    wx.request({
      url: e.data.url + "del/score/delComment",
      data: {
        cid: a
      },
      success: function (t) {
        console.log(t), wx.showToast({
          title: "删除成功"
        }), e.getCommentList(e.data.mainItem.kid);
      }
    });
  },
  btnClick(e) {
    let _this = this
    if (e.detail.value == 1) {
      //举报
      wx.showModal({
        title: '举报',
        editable: true,
        placeholderText: '在此输入内容',
        success: res => {
          if (res.confirm) {
            if (res.content.trim() == '') {
              wx.showToast({
                title: '举报内容不能为空！',
                icon: 'error'
              })
              return
            } else {
              wx.showToast({
                title: '举报成功',
              })
            }
          }
          _this.setData({
            showActionsheet: false
          })
        }
      })
    } else if (e.detail.value == 2) {
      //删除
      wx.showModal({
        title: '提示',
        content: '是否要删除?',
        success: res => {
          if (res.confirm) {
            app.request({
              url: _this.data.url + "del/score/delComment?cid=" + _this.data.actionSheetSid,
              success: res => {
                console.log(res)
                wx.showToast({
                  title: '删除成功！',
                })
                _this.getCommentList(showId)
                _this.setData({
                  showActionsheet: false
                })
              }
            })
          }
        }
      })

    }
  },
  showActionSheet: function (t) {
    t.currentTarget.dataset.ismine ? this.setData({
      groups: [{
        text: "删除",
        value: 2
      }]
    }) : this.setData({
      groups: [{
        text: "举报",
        value: 1
      }]
    }), this.setData({
      showActionsheet: !0,
      actionSheetSid: t.currentTarget.dataset.id
    }), console.log(t.currentTarget.dataset.id);
  },
  anonymousCheck: function (t) {
    0 == t.detail.value.length ? this.setData({
      anonymous: 0
    }) : this.setData({
      anonymous: 1
    });
  },
  evalShow: function () {
    this.setData({
      modalName: "post"
    });
  },
  hideModal: function (t) {
    this.setData({
      modalName: null
    });
  },
  donothing: function () { }
});