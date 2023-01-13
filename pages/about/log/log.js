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
            title: "川大IN",
            path: this.route
        };
    }
});