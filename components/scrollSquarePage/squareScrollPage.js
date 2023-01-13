const app = getApp()
const baseUrl = app.globalData.url
const utils = require("../../utils/utils.js")
var page = 1;
var isSearch = false
var searchValue = ""
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        requesturl: {
            type: String,
            value: 'square/getSquareList'
        },
        enbaleRefresh: {
            type: Boolean,
            value: true
        },
        showSkeleton: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        squareList: [
            []
        ],
        isGetting: true,
        end: false,
        user: null,
        refresh: false,
        isSearch: false,
        isScrollToTop: false
    },

    lifetimes: {
        attached(e) {
            let _this = this
            _this.setData({
                user: app.globalData.user
            })
            if (app.globalData.completeLogin) {
                page = 1;
                _this.getSquares()
            } else {
                app.loginCallback = function (res) {
                    page = 1;
                    _this.getSquares()
                    _this.setData({
                        user: res.user
                    })
                }
            }
            this.setData({
                systemInfo: app.globalData.systemInfo,
                user: app.globalData.user
            })
        },

    },
    /**
     * 组件的方法列表
     */
    methods: {
        //获取post列表
        getSquares(e) {
            const _this = this
            if ((_this.data.isGetting && page != 1) || _this.data.end) return
            _this.setData({
                isGetting: true
            })
            let requestUrl
            if (isSearch) {
                requestUrl = baseUrl + 'square/search?value=' + searchValue + "&page=" + page
            } else {
                requestUrl = baseUrl + _this.properties.requesturl
            }
            app.request({
                url: requestUrl,
                data: {
                    page: page
                },
                success: res => {
                    if (!res.data.data) {
                        _this.setData({
                            end: true,
                            isGetting: false
                        })
                        return
                    }

                    _this.setData({
                        ["squareList[" + _this.data.squareList.length + "]"]: res.data.data,
                        isGetting: false
                    })

                    if (res.data.data.length < 15) {
                        _this.setData({
                            end: true
                        })
                    }

                    console.log(_this.data.squareList)
                    page++;
                }
            })
        },
        //刷新操作
        refresh() {
            let _this = this
            wx.showLoading({
                title: '刷新中',
            })
            _this.setData({
                refresh: true
            })

            app.request({
                url: baseUrl + (isSearch ? ('square/search?value=' + searchValue + "&page=" + page) : _this.properties.requesturl),
                data: {
                    page: 1
                },
                success: res => {
                    wx.hideLoading()

                    wx.showToast({
                        title: '刷新成功',
                        icon: 'success'
                    })

                    let list = []

                    for (let i = 0; i < res.data.data.length; i++) {
                        let index = utils.isInList(_this.data.squareList[1], res.data.data[i].sid)
                        if (index == -1) {
                            list.push(res.data.data[i])
                        } else {
                            _this.setData({
                                ['squareList[1][' + index + ']']: res.data.data[i]
                            })
                        }
                    }

                    _this.setData({
                        ["squareList[0]"]: list,
                        refresh: false
                    })
                },
                fail: err => console.log(err)
            })

        },
        //搜索
        search(search_value) {
            console.log("213213")
            let _this = this
            page = 1;
            searchValue = search_value

            _this.setData({
                squareList: [
                    []
                ],
                end: false,
                isGetting: false
            })
            console.log(searchValue)
            if (searchValue) {
                isSearch = true
            } else {
                isSearch = false
            }
            this.getSquares()
        },
        pushOne(item) {
            let _this = this
            let list = _this.data.squareList[0]
            list.unshift(item)
            _this.setData({
                ['squareList[0]']: list
            })
        },
        scrollToTop() {
            this.setData({
                isScrollToTop: true
            })
        }
    }
})