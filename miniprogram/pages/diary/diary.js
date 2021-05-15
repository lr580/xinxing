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
    attration:null,
    looking: [],
    diaryDate: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  upd_date() {
    var temp = []
    for (let i = 0; i < km.globalData.diary.length; ++i) {
      temp.push(km.date2str(km.globalData.diary[i].time))
    }
    // console.log(temp)
    return temp
  },

  upd_look(){
    var temp = []
    for (let i = 0; i < km.globalData.diary.length; ++i) {
      temp.push(false)
    }
    return temp
  },



  onLoad: function (options) {
    var thee = this
    // var temp = []
    
    var hg = function () {
      // console.log('qwqq', km.globalData.diary)
      thee.setData({
        user: km.globalData.user,
        diary: km.globalData.diary,
        attration: km.globalData.attration,
        diaryDate: thee.upd_date(),
        looking: thee.upd_look(),
      })
      // console.log('oh yes')
    }
    this.hg=hg
    km.cb2 = hg
    km.cb2()
    // console.log(km.globalData.user)
    // thee.setData({
    //   user: km.globalData.user,
    //   diary: km.globalData.diary,
    //   diaryDate: upd_date(),
    // })
    // console.log('it born')
  },

  onShow: function () {
    // console.log('it live', km.globalData.user.diary)
    // console.log('this')
    // km.cb2()
    // console.log(this.)
    if(typeof this.hg == 'function'){
      // console.log('123')
      this.hg()
    }
    // setTimeout(km.cb2, 1500);
    // this.setData({
    //   user: km.globalData.user,
    //   diary: km.globalData.diary,
    //   diaryDate: upd_date(),
    // })
    if (!km.globalData.user) {
      wx.showToast({
        title: '请您先登录再使用“心路”功能',
        icon: 'none',
      })
    }
  },

  look(v) {
    var idx = Number(v.currentTarget.id)
    // console.log(idx)
    this.data.looking[idx]=!this.data.looking[idx]
    this.setData({
      looking:this.data.looking,
    })
  },

  edit(v) {
    if (!km.globalData.user) {
      wx.showToast({
        title: '请您先登录再使用“心路”功能',
        icon: 'none',
      })
      return
    }
    var idx = Number(v.currentTarget.id)
    // console.log(idx)

    wx.navigateTo({
      // url: '/pages/testeditor/editor?edit=1&s_att_id='+String(this.data.diary[idx].att_id)
      // +'&s_att_name='+String(this.data.diary[idx].att_name)+'&s_time='+km.date2str(this.data.diary[idx].time)+
      // '&s_content='+String(this.data.diary[idx].content)+'&s_id='+String(this.data.diary[idx]._id),
      url: '/pages/testeditor/editor?edit=1&id='+String(idx),//+String(this.data.diary[idx]._id),
    })
    // km.cb2()
    // console.log('qwq')
  },

  del(v) {
    if (!km.globalData.user) {
      wx.showToast({
        title: '请您先登录再使用“心路”功能',
        icon: 'none',
      })
      return
    }
    var idx = Number(v.currentTarget.id)
    const thee = this
    if (thee.data.busy) {
      wx.showToast({
        title: '请不要频繁点击',
        icon: 'none',
      })
      return
    }
    thee.data.busy = true
    // console.log(idx)
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '提示',
      content: '确认要删除吗？',
      success(res) {
        if (res.confirm) {
          // console.log('是')
          // thee.delz(thee.data.diary[idx])
          var attid = thee.data.diary[idx]['att_id']
          km.globalData.user.diary.splice(km.globalData.user.diary.indexOf(Number(thee.data.diary[idx]['_id'])), 1)
          // console.log('fuck',thee.data.user.diary)
          var still = false
          for (let i = 0; i < thee.data.diary.length; ++i) {
            if (i == idx) { continue }
            // console.log(thee.data.diary[i]['att_id'],attid,i,idx)
            if (thee.data.diary[i]['att_id'] == attid) {
              still = true
              break
            }
          }
          km.globalData.diary.splice(idx, 1)
          if (!still) {
            km.globalData.user.gone.splice(km.globalData.user.gone.indexOf(attid), 1)
          }
          // console.log(thee.data.user.gone, still)
          // return
          db.collection('user').doc(km.globalData.openid).update({
            data: {
              diary: thee.data.user.diary,//_.pop(thee.data.diary[idx])
              gone: thee.data.user.gone,
            }
          }).then(res => {
            wx.showToast({
              title: '删除成功！',
              icon: 'none',
            })
            thee.data.busy = false
            wx.hideLoading({
              success: (res) => { },
            })
            thee.setData({
              diary: thee.data.diary,
              user: thee.data.user,
            })
          }).catch(rws => {
            wx.showToast({
              title: '删除失败！',
              icon: 'none',
            })
            thee.data.busy = false
            wx.hideLoading({
              success: (res) => { },
            })
          })
          // console.log(thee.data.diary)
        } else {
          // console.log('false')
          thee.data.busy = false
        }
      }
    })
  },

  // delz(idx) {

  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  postz() {
    // console.log('123')
    if (!km.globalData.user) {
      wx.showToast({
        title: '请您先登录再使用“心路”功能',
        icon: 'none',
      })
      return
    }
    wx.navigateTo({
      // url: '/pages/postp/postp',
      url: '/pages/testeditor/editor?edit=0',
    })
    // km.cb2()
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