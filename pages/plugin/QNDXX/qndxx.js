const app = getApp()
var url
Page({
    data: {
        numList: [{
            name: '获取token'
        }, {
            name: '选择团组织'
        }, {
            name: '填写信息'
        }, {
            name: '确认信息'
        }],
        num: 0,
        token: '没有得到token，不可手动输入',
        picker1: null,
        index1: null,
        picker2: null,
        index2: null,
        name: '',
        phone: '',
        mine: null,
        expired: false
    },
    onLoad(e) {
        let _this = this
        url = app.globalData.url
        app.request({
            url: url + "dxx/getMyDxx",
            success: res => {
                console.log(res)
                _this.setData({
                    mine: res.data.data
                })
                if (res.data.data && res.data.data.token) {
                    _this.setData({
                        token: res.data.data.token
                    })
                    wx.request({
                        url: 'https://duomi.chenyipeng.com/dxx/api/student/studyHostory',
                        data: {
                            pageSize: 10,
                            pageNo: 1
                        },
                        method: 'POST',
                        header: {
                            "token": _this.data.token
                        },
                        success: res => {
                            console.log(res)
                            if (res.data.code != 200) {
                                _this.setData({
                                    expired: true
                                })
                            }
                            _this.setData({
                                studyHistory: res.data.data
                            })
                        }
                    })
                }
            }
        })

    },
    //跳转获取token
    getToken() {
        wx.navigateToMiniProgram({
            appId: 'wx2f80896fbecfdaa6',
            envVersion: 'trial',
            path: "/pages/webview/webview"
        })
    },
    onShow(e) {
        let _this = this
        let code = app.globalData.dxxcode
        if (code && code != 'undefined') {
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            wx.request({
                url: "https://duomi.chenyipeng.com/dxx/api/wechat/login",
                method: 'post',
                data: {
                    code: code
                },
                header: {
                    "content-type": "application/json"
                },
                success: res => {
                    console.log(res)
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    if (res.data.code == 200) {
                        _this.setData({
                            token: res.data.data.token
                        })
                    }

                },
                fail: err => {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                }
            })
        }
        // wx.showModal({
        //   content: e ? JSON.stringify(e) : '',
        // })
    },
    tokenFinsished() {
        let _this = this
        this.setData({
            num: 1
        })
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            url: 'https://duomi.chenyipeng.com/dxx/api/organize/list',
            data: {
                pid: 35236
            },
            method: 'POST',
            header: {
                "token": _this.data.token
            },
            success: res => {
                wx.hideLoading({
                    success: (res) => {},
                })
                console.log(res.data)
                _this.setData({
                    picker1: res.data.data
                })
            }
        })

    },
    pickerChange(e) {
        let _this = this
        let id = e.currentTarget.dataset.index
        let value = e.detail.value
        _this.setData({
            ["index" + id]: value
        })
        if (id == 1) {
            this.setData({
                index2: null
            })
        }
        if (id == 2) return
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            url: 'https://duomi.chenyipeng.com/dxx/api/organize/list',
            data: {
                pid: _this.data['picker' + id][value].value
            },
            method: 'POST',
            header: {
                "token": _this.data.token
            },
            success: res => {
                wx.hideLoading({
                    success: (res) => {},
                })
                _this.setData({
                    ["picker" + (parseInt(id) + 1)]: res.data.data
                })
                console.log(_this.data)
            }
        })
    },
    zzFinished() {
        this.setData({
            num: 2
        })
    },
    xxFinished() {
        if (this.data.name == '' || this.data.phone == '') {
            wx.showToast({
                title: '请先补充完成信息',
                icon: 'error'
            })
            return
        }
        let _this = this
        let picker1Obj = this.data.picker1[this.data.index1]
        let picker2Obj = this.data.picker2[this.data.index2]
        console.log(picker1Obj)
        console.log(picker2Obj)
        let orgName = picker2Obj.label
        let org = "#4#35236#" + picker1Obj.value + "#" + picker2Obj.value + "#"
        let allOrgName = "#省直属#四川大学#" + picker1Obj.label + "#" + picker2Obj.label + "#"
        let name = this.data.name
        let lastOrg = picker2Obj.value
        let tel = this.data.phone

        let formdata = {
            orgName: orgName,
            org: org,
            allOrgName: allOrgName,
            name: name,
            lastOrg: lastOrg,
            tel: tel,
            token: _this.data.token
        }
        console.log(formdata)
        this.setData({
            num: 3,
            formdata: formdata
        })
    },
    add() {
        console.log(this.data.formdata)
        let _this = this
        wx.showLoading({
            title: '添加中',
            mask: true
        })
        app.request({
            url: url + "dxx/addDxx",
            data: _this.data.formdata,
            success: res => {
                console.log(res)
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.showToast({
                    title: '添加成功',
                })
                setTimeout(() => {
                    _this.onLoad()
                }, 600)
            }
        })
    },
    previous() {
        this.setData({
            num: this.data.num - 1
        })
    },
    delAccount() {
        let _this = this
        wx.showModal({
            content: '是否确认删除？',
            title: '提示',
            success: res => {
                if (res.confirm) {
                    wx.showLoading({
                        title: '删除中',
                        mask: true
                    })
                    app.request({
                        url: url + "dxx/delDxx",
                        success: res => {
                            console.log(res)
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            wx.showToast({
                                title: '删除成功',
                            })
                            _this.setData({
                                token: '没有得到token，不可手动输入',
                                mine: null
                            })
                        }
                    })
                }
            }
        })
    },
    toggleOn() {
        if (this.data.expired) {
            wx.showToast({
                title: 'token已过期！',
                icon: 'error'
            })
            return
        }
        let mine = this.data.mine
        mine.confirm = mine.confirm == 1 ? 0 : 1
        this.setData({
            mine: mine
        })

        app.request({
            url: url + "dxx/updateDxx",
            success: res => {
                wx.showToast({
                    title: mine.confirm == 1 ? '开启成功' : '关闭成功',
                })
            }
        })
    },
    studyNow() {
        if (this.data.expired) {
            wx.showToast({
                title: 'token已过期',
                icon: 'error'
            })
            return
        }
        let formdata = this.data.mine
        let _this = this
        delete formdata.token
        delete formdata.uid
        delete formdata.confirm
        console.log(formdata)
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: 'https://duomi.chenyipeng.com/dxx/api/student/commit',
            data: formdata,
            method: 'POST',
            header: {
                "token": _this.data.token
            },
            success: res => {
                wx.hideLoading({
                    success: (res) => {},
                })
                if (res.data.code != 200) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'error'
                    })
                } else {
                    wx.showToast({
                        title: '学习成功',
                    })
                    setTimeout(() => {
                        _this.onLoad()
                    }, 600)
                }
            }
        })
    }
})