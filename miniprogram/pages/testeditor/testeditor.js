// miniprogram/pages/testeditor/testeditor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onEditorReady() {
    const that = this
    const query = wx.createSelectorQuery()//创建节点查询器
    query.in(that).select('#editor').context()//选择id=editor的节点，获取节点内容信息
    
    query.exec(function(res){
        that.editorCtx = res.context
        console.log(res.context);
      })
   },

   getContent() {
    const that = this
    that.editorCtx.getContents({
      success: function (res) {   
        console.log(res.detla)
      },
      fail: function (error){
        console.log(error)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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