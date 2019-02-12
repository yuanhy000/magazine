import {
    ClassicModel
} from '../../models/classic.js'
import {
    LikeModel
} from '../../models/like.js'
//import 引用相对路径
let classicModel = new ClassicModel()
let likeModel = new LikeModel()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        classicData: null,
        latest: true,
        first: false,
        likeCount: 0,
        likeStatus: false
    },
    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        classicModel.getLatest((res) => {
            // this._getLikeStatus(res.id, res.type)
            this.setData({
                classicData: res,
                likeCount: res.fav_nums,
                likeStatus: res.like_status
            })
        })
    },
    onLike: function(event) {
        console.log(event)
        let behavior = event.detail.behavior
        likeModel.like(behavior, this.data.classicData.id, this.data.classicData.type)
    },
    onNext: function(event) {
        this._updateClassic('next')
    },
    onPrevious: function(event) {
        this._updateClassic('previous')
    },
    _updateClassic: function(nextOrPrevious) {
        let index = this.data.classicData.index
        classicModel.getClassic(index, nextOrPrevious, (res) => {
            this._getLikeStatus(res.id, res.type)
            this.setData({
                classicData: res,
                latest: classicModel.isLatest(res.index),
                first: classicModel.isFirst(res.index)
            })
        })
    },
    _getLikeStatus: function(artID, category) {
        likeModel.getClassicLikeStatus(artID, category, (res) => {
            this.setData({
                likeCount: res.fav_nums,
                likeStatus: res.like_status
            })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
})