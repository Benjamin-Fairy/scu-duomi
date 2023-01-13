var a = getApp();

Page({
    data: {
        StatusBar: a.globalData.StatusBar,
        CustomBar: a.globalData.CustomBar,
        ColorList: a.globalData.ColorList
    },
    onLoad: function() {},
    pageBack: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    onShareAppMessage: function(a) {
        return {
            title: "一个不知名的小程序",
            path: this.route
        };
    }
});