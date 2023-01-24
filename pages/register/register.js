// pages/register/register.js
const app = getApp()
const nameArray = require('./name').nameArray
const xieyi = require('../index/xieyi').xieyi
Page({

  data: {
    avatarUrl: '',
    modalName: '',
    nickName: '',
    gender: '0',
    xieyi: xieyi
  },

  onLoad() {
    this.getNickName()
    let gender = Math.floor(Math.random() * 2) + 1
    this.setData({
      avatarUrl: "https://duomi.chenyipeng.com/static/avatar/" + (gender == 2 ? "girl" : "boy") + "-" + (Math.floor(Math.random() * 8) + 1) + '.png',
      gender: gender
    })
  },
  xieyiChange(e) {
    0 == e.detail.value.length ? this.setData({
      readCheck: 0
    }) : this.setData({
      readCheck: 1
    });
  },
  showXieyi() {
    this.setData({
      modalName: 'xieyi'
    })
  },

  getNickName() {
    let headName = nameArray.headerName[Math.floor(Math.random() * nameArray.headerName.length)]
    let foodName = nameArray.foodName[Math.floor(Math.random() * nameArray.foodName.length)]
    this.setData({
      nickName: headName + foodName
    })
  },
  confirm() {
    let avatarUrl = this.data.avatarUrl
    let gender = this.data.gender
    let nickName = this.data.nickName
    if (!this.data.readCheck) {
      wx.showToast({
        title: '请先同意隐私和使用条款',
        icon: 'none'
      })
      return
    }
    if (nickName.trim() == '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'error'
      })
      return
    }
    if (gender == '0') {
      wx.showToast({
        title: '请选择性别',
        icon: 'error'
      })
      return
    }
    wx.showLoading({
      title: '注册中...',
      mask: true
    })
    wx.login({
      success: function (o) {
        wx.request({
          url: app.globalData.url + "user/register/duomi",
          data: {
            nickName: nickName,
            avatarUrl: avatarUrl,
            gender: gender,
            JSCode: o.code
          },
          success: function (t) {
            console.log(t.data)
            wx.setStorageSync("user", t.data.user)
            app.globalData.ticket = t.data.ticket
            app.globalData.user = t.data.user
            app.globalData.completeLogin = true
            wx.hideLoading()
            wx.showToast({
              title: '注册成功！',
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 500)
          },
        });
      }
    });
  },
  radioChange(e) {
    console.log(e)
    this.setData({
      gender: e.detail.value
    })
  },
  chooseAvatar(e) {
    let gender = e.currentTarget.dataset.gender
    let index = e.currentTarget.dataset.index
    this.setData({
      avatarUrl: 'https://duomi.chenyipeng.com/static/avatar/' + gender + '-' + index + '.png',
      modalName: ''
    })
  },
  hideModal() {
    this.setData({
      modalName: ''
    })
  },
  showAvatar() {
    this.setData({
      modalName: 'avatar'
    })
  }


})