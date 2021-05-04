// miniprogram/pages/diary/diary.js
const km = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    diary: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thee = this
    var hg = function () {
      thee.setData({
        user: km.globalData.user,
        diary: km.globalData.diary,
      })
    }
    km.cb2 = hg
    // km.cb2()
    thee.setData({
      user: km.globalData.user,
      diary: km.globalData.diary,
    })
    // console.log('it born')
  },

  onShow: function () {
    // console.log('it live', km.globalData.user.diary)
    // km.cb2()
    this.setData({
      user: km.globalData.user,
      diary: km.globalData.diary,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  postz() {
    // console.log('123')
    wx.navigateTo({
      // url: '/pages/postp/postp',
      url: '/pages/testeditor/editor'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {

  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})