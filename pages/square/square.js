// pages/square/index/index.js
const app = getApp()
const baseUrl = app.globalData.url;
var isShow = 1
var lastTapStamp = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {

    user: null,

  },
  onShow() {
    this.setData({
      user: app.globalData.user
    })
  },
  onLoad(options) { },
  onReady() {
    this.setData({
      user: app.globalData.user
    })
  },
  add() {
    wx.openEmbeddedMiniProgram({
      appId: 'wx2f80896fbecfdaa6',
      path: '/pages/duomi/post/post',
      envVersion: 'trial',
    })
  },

  onShareAppMessage: function (e) {
    return {
      title: "",
      path: this.route
    };
  },



})