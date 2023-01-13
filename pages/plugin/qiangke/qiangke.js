var t = getApp();

Page({
    data: {
        url: "",
        canIqk: !1,
        form_username: "",
        form_password: "",
        form_kch: "",
        form_kxh: ""
    },
    onLoad: function(o) {
        var a = this;
        this.setData({
            url: t.globalData.url
        }), t.request({
            url: a.data.url + "qiangke/init",
            success: function(t) {
                console.log(t.data), a.setData({
                    list: t.data.result,
                    canIqk: t.data.canIqk
                });
            },
            fail: function(t) {
                return console.log(t);
            }
        });
    },
    add: function(o) {
        if (t.userRegister()) {
            var a = this, e = this.data.form_username, s = this.data.form_password, n = this.data.form_kch, i = this.data.form_kxh;
            console.log("用户名" + e + "密码" + s + "课程号" + n + "课序号" + i), /^\d+$/.test(i) && /^\d+$/.test(n) ? n && i && e && s ? wx.requestSubscribeMessage({
                tmplIds: [ "rttpmTJEdgOuvqY0ZR3LSIa_JIamU4VXMN1yu3leJVw" ],
                success: function(o) {
                    wx.showLoading({
                        title: "添加中",
                        mask: !0
                    }), t.request({
                        url: a.data.url + "qiangke/add",
                        data: {
                            username: e,
                            password: s,
                            kch: n,
                            kxh: i
                        },
                        success: function(t) {
                            290 == t.data.code ? (wx.hideLoading(), wx.showToast({
                                title: "抢课队列已满，稍后再试！",
                                icon: "error"
                            })) : 280 == t.data.code ? (wx.hideLoading(), wx.showToast({
                                title: "账号或密码不正确",
                                icon: "error"
                            })) : 270 == t.data.code ? (wx.hideLoading(), wx.showToast({
                                title: "一次仅可以抢一个课",
                                icon: "error"
                            })) : (a.hideModal(), wx.hideLoading(), wx.showToast({
                                title: "添加成功",
                                mask: !0
                            }), setTimeout(function() {
                                a.onLoad();
                            }, 800));
                        },
                        fail: function(t) {
                            a.setData({
                                isAdding: ""
                            }), console.log(t);
                        }
                    });
                },
                fail: function(t) {
                    console.log(t);
                }
            }) : wx.showToast({
                title: "信息不全",
                icon: "error"
            }) : wx.showToast({
                title: "课程号或课序号有问题",
                icon: "error"
            });
        }
    },
    showModal: function(t) {
        this.data.canIqk ? this.setData({
            modalName: t.currentTarget.dataset.target
        }) : wx.showToast({
            title: "非选课期间",
            icon: "none"
        });
    },
    hideModal: function(t) {
        this.setData({
            modalName: null
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});