var e = getApp();

Component({
  data: {
    url: "",
    count: 0,
    now: new Date().getTime(),
    accountInfo: wx.getAccountInfoSync(),

  },
  lifetimes: {
    attached: function () {
      var t = this;
      this.setData({
        url: e.globalData.url,
        userInfo: e.globalData.user
      });
      if (e.globalData.user) {
        console.log(e)
        this.setData({
          userInfo: e.globalData.user
        })
      } else {
        e.loginReadyCallBack = function (a) {
          t.setData({
            userInfo: e.globalData.user
          })
        }
      }
    },
  },
  methods: {
    showImg: function (e) {
      var t = e.currentTarget.dataset.url;
      wx.previewImage({
        urls: [t],
        current: t
      });
    },

    getUnreadInfrom: function () {
      this.setData({
        count: e.globalData.unReadCount
      });
    },
    scan() {
      let _this = this;
      try {
        wx.showLoading({
          title: '加载中',
        })
        wx.scanCode({
          onlyFromCamera: false,
          success: res => {
            res = JSON.parse(res.result)
            e.request({
              url: _this.data.url + "handleUrl",
              data: {
                type: res.type,
                key: res.key
              },
              complete: res => {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            })
          }
        })
      } catch (error) {
        wx.showToast({
          title: '验证码无效！',
          icon: 'error'
        })
      }

    },
    getUserInfo: function (t) {
      e.userRegister();
    },
    goToSetting: function () {
      wx.navigateTo({
        url: "/pages/about/setting/setting"
      });
    },
    CopyLink: function (e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: function (e) {
          wx.showToast({
            title: "已复制",
            duration: 1e3
          });
        }
      });
    },
    showModal: function (e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      });
    },
    hideModal: function (e) {
      this.setData({
        modalName: null
      });
    },
  }

});