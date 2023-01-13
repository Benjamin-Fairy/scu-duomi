Page({
  data: {
    modalName: "",
    modalNameSub: "",
    itemList: [],
    currentItemList: 0,
    ItemListName: "",
    itemName: "",
    blocks: [{
      padding: '13px',
      background: '#617df2'
    }],
    prizes: [],
    buttons: [{
        radius: '40px',
        background: '#617df2'
      },
      {
        radius: '35px',
        background: '#afc8ff'
      },
      {
        radius: '30px',
        background: '#869cfa',
        pointer: true,
        fonts: [{
          text: '开始',
          top: '-15px'
        }]
      },
    ],
  },
  start() {
    // 获取抽奖组件实例
    const child = this.selectComponent('#myLucky')
    // 调用play方法开始旋转
    child.lucky.play()
    // 用定时器模拟请求接口
    setTimeout(() => {
      // 3s 后得到中奖索引 (假设抽到第0个奖品)
      let length = this.data.itemList[this.data.currentItemList].item.length
      let index  = Math.floor(Math.random()*length)
      console.log(index)
      // 调用stop方法然后缓慢停止
      child.lucky.stop(index)
    }, 3000)
  },
  end(event) {
    // 中奖奖品详情
    console.log(event.detail)
  },
  onLoad: function (t) {
    this.init()
    this.setData({
      itemList: wx.getStorageSync("chooseForMe_list"),
      currentItemList: wx.getStorageSync("chooseForMe_currentItemList") ? wx.getStorageSync("chooseForMe_currentItemList") : 0
    });
    this.updateData()
  },
  init: function () {
    wx.getStorageSync("chooseForMe_list") || wx.setStorageSync("chooseForMe_list", [{
      name: "去哪吃?",
      item: ["西园一餐", "西园二餐", "牛肉馆", "东园一餐厅", "不吃了"]
    }, {
      name: "旷不旷课?",
      item: ["旷", "不旷"]
    }]);
  },
  onShow: function () {
    var t = this;
    wx.onAccelerometerChange(function (e) {
      if (e.x > .7 && e.y > .7 && !t.data.done) {
        if (0 == t.data.itemList.length || 0 == t.data.itemList[t.data.currentItemList].item.length) return void wx.showToast({
          title: "好像没东西啊!",
          icon: "error"
        });
        var a = t.data.itemList[t.data.currentItemList].item,
          i = a[Math.floor(Math.random() * a.length)];
        t.setData({
          result: i
        }), wx.vibrateLong(), t.setData({
          shake: !0
        }), setTimeout(function () {
          t.setData({
            shake: !1,
            done: !0
          }), setTimeout(function () {
            t.setData({
              show: !0
            }), setTimeout(function () {
              t.setData({
                showOnScreen: !0
              });
            }, 600);
          }, 500);
        }, 2e3);
      }
    });
  },
  action: function (t) {
    var e = this;
    if (this.data.done) this.setData({
      done: !1,
      shake: !1,
      show: !1,
      showOnScreen: !1
    });
    else {
      if (0 == this.data.itemList.length || 0 == this.data.itemList[this.data.currentItemList].item.length) return void wx.showToast({
        title: "好像没东西啊!",
        icon: "error"
      });
      var a = this.data.itemList[this.data.currentItemList].item,
        i = a[Math.floor(Math.random() * a.length)];
      this.setData({
        result: i
      }), wx.vibrateLong(), this.setData({
        shake: !0
      }), setTimeout(function () {
        e.setData({
          shake: !1,
          done: !0
        }), setTimeout(function () {
          e.setData({
            show: !0
          }), setTimeout(function () {
            e.setData({
              showOnScreen: !0
            });
          }, 600);
        }, 500);
      }, 2e3);
    }
    this.updateData()
  },

  delFromItemList: function (t) {
    var e = this.data.itemList;
    e.splice(t.currentTarget.dataset.id, 1), this.setData({
      itemList: e
    }), wx.setStorageSync("chooseForMe_list", e), t.currentTarget.dataset.id == this.data.currentItemList && (this.setData({
      currentItemList: 0
    }), wx.setStorageSync("chooseForMe_currentItemList", 0));
    this.updateData()
  },
  chooseItemList: function (t) {
    wx.setStorageSync("chooseForMe_currentItemList", t.currentTarget.dataset.id), this.setData({
      currentItemList: t.currentTarget.dataset.id,
      modalName: ""
    });
    this.updateData()
  },
  donothing: function () {},
  input: function (t) {
    var e = t.currentTarget.dataset.target,
      a = t.detail.value;
    "ItemListName" == e ? this.setData({
      ItemListName: a
    }) : this.setData({
      itemName: a
    });
  },
  add: function (t) {
    var e = this.data.itemList;
    if ("ItemListName" == t.currentTarget.dataset.target) {
      if (!this.data.ItemListName || "" == this.data.ItemListName.trim()) return void wx.showToast({
        title: "请输入名称",
        icon: "error"
      });
      var a = {
        name: this.data.ItemListName,
        item: []
      };
      this.data.itemList.push(a);
    } else {
      if (!this.data.itemName || "" == this.data.itemName.trim()) return void wx.showToast({
        title: "请输入名称",
        icon: "error"
      });
      var i = e[this.data.currentItemList],
        s = i.item;
      s.push(this.data.itemName), i.item = s, e[this.data.currentItemList] = i;
      this.updateData()
    }
    this.setData({
      itemList: e,
      ItemListName: "",
      itemName: "",
      modalNameSub: ""
    }), wx.setStorageSync("chooseForMe_list", e);
  },
  updateData() {
    const colorArray = ['#e9e8fe', '#b8c5f2', '#5169be']
    let index = this.data.currentItemList
    let itemList = this.data.itemList
    let list = itemList[index].item
    let prize = new Array(list.length)
    for (let i = 0; i < list.length; i++) {
      prize[i] = {
        fonts: [{
          text: list[i],
          top: '10%'
        }],
        background: colorArray[i % 3]
      }
    }
    this.setData({
      prizes: prize
    })
    console.log(this.data.prizes)
  },
  delFromItem: function (t) {
    var e = this.data.itemList,
      a = e[this.data.currentItemList],
      i = a.item;
    i.splice(t.currentTarget.dataset.id, 1), a.item = i, e[this.data.currentItemList] = a,
      this.setData({
        itemList: e
      }), wx.setStorageSync("chooseForMe_list", e);
      this.updateData()
  },
  showModal: function (t) {
    this.setData({
      modalName: t.currentTarget.dataset.target
    });
  },
  showModalSub: function (t) {
    this.setData({
      modalNameSub: t.currentTarget.dataset.target
    });
  },
  hideModal: function () {
    this.setData({
      modalName: ""
    });
  },
  hideModalSub: function () {
    this.setData({
      modalNameSub: ""
    });
  }
});