// pages/register/register.js
const app = getApp()
const nameArray = require('./name').nameArray
Page({

  data: {
    avatarUrl: 'http://duomi.chenyipeng.com/static/avatar/boy-1.png',
    modalName: '',
    nickName: '',
    gender: '0'
  },

  onLoad() {
    this.getNickName()
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