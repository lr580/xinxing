// miniprogram/pages/myattra/myattra.js
const km = getApp()
// import lottie from 'lottie-miniprogram'
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    var idx = Number(e.currentTarget.dataset.id)
    var temp = []
    var temd = []
    var temg = []
    if (idx == 0) {
      for (let i = 0; i < this.data.user.like.length; ++i) {
        temp.push(this.data.user.like[i])
        temd.push(false)
        temg.push(this.data.user.gone.indexOf(temp[i]) != -1)
      }
    } else {
      for (let i = 0; i < this.data.user.dislike.length; ++i) {
        temp.push(this.data.user.dislike[i])
        temd.push(false)
        temg.push(this.data.user.gone.indexOf(temp[i]) != -1)
      }
    }
    // console.log('temp',temp,temd,temg)
    // console.log(idx)
    this.setData({
      now_block: idx,
      fked: temp,
      detail_on: temd,
      gone: temg,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.upd()
    // if(this.data.user==null){
    //   wx.na
    // }
  },

  upd(){
    this.setData({
      user: km.globalData.user,
      city: km.globalData.city,
      attration: km.globalData.attration,
      now_block: 0,
      pathc: km.globalData.pathc + 'attra/',
      fked: [],
      detail_on: [], //注意这个和下面那个数组的下标 跟展示i对应，即fked的下标，不跟fked的值对应
      gone: [],
      busy: false,//防止连点
    })
    this.sele_block({ detail: { value: 0 } })
  },

  sele_block(p) {

    var idx = Number(p.detail.value)
    var temp = []
    var temd = []
    var temg = []
    if (idx == 0) {
      for (let i = 0; i < this.data.user.like.length; ++i) {
        temp.push(this.data.user.like[i])
        temd.push(false)
        temg.push(this.data.user.gone.indexOf(temp[i]) != -1)
      }
    } else {
      for (let i = 0; i < this.data.user.dislike.length; ++i) {
        temp.push(this.data.user.dislike[i])
        temd.push(false)
        temg.push(this.data.user.gone.indexOf(temp[i]) != -1)
      }
    }
    // console.log('temp',temp,temd,temg)
    // console.log(idx)
    this.setData({
      now_block: idx,
      fked: temp,
      detail_on: temd,
      gone: temg,
    })

  },

  detail_onz(v) {
    var idx = Number(v.currentTarget.id)
    var temp = []
    for (let i = 0; i < this.data.detail_on.length; ++i) {
      temp.push(this.data.detail_on[i])
    }
    temp[idx] = true
    this.setData({
      detail_on: temp
    })
  },

  detail_offz(v) {
    var idx = Number(v.currentTarget.id)
    var temp = []
    for (let i = 0; i < this.data.detail_on.length; ++i) {
      // temp.push(false)
      temp.push(this.data.detail_on[i])
    }
    temp[idx] = false
    this.setData({
      detail_on: temp
    })
  },

  deny_tag(v) {
    if (this.data.busy) {
      wx.showToast({
        title: '请不要频繁点击',
        icon: 'none',
      })
      return
    }
    var idx = Number(v.currentTarget.id)
    var hg = {}
    var temp = []
    const thee = this
    this.data.busy = true
    if (this.data.now_block == 0) {
      hg['like'] = _.pop(idx)
      for (let i = 0; i < this.data.user.like.length; ++i) {
        if (this.data.user.like[i] != idx) {
          temp.push(this.data.user.like[i])
        }
      }
      this.data.user.like = temp
    } else {
      hg['dislike'] = _.pop(idx)
      for (let i = 0; i < this.data.user.dislike.length; ++i) {
        if (this.data.user.dislike[i] != idx) {
          temp.push(this.data.user.dislike[i])
        }
      }
      this.data.user.dislike = temp
    }

    db.collection('user').doc(km.globalData.openid).update({
      data: hg
    }).then(res => {
      thee.setData({
        busy: false,
        user: thee.data.user
      })
      km.cb(thee.data.user)
      thee.sele_block({ detail: { value: thee.data.now_block } })
      wx.showToast({
        title: '修改成功！',
      })
    }).catch(rws => {
      thee.setData({
        busy: false,
      })
      wx.showToast({
        title: '修改失败，请重试！',
        icon: 'none',
      })
    })
  },

  change_gone(v) {
    if (this.data.busy) {
      wx.showToast({
        title: '请不要频繁点击',
        icon: 'none',
      })
      return
    }
    var idx = Number(v.currentTarget.id)
    var iidx = this.data.fked[idx]
    var hg = {}
    var temp = []
    const thee = this
    this.data.busy = true
    if (this.data.user.gone.indexOf(iidx) != -1) {
      // hg['gone'] = _.pop(iidx)
      // console.log(this.data.user.gone, iidx)
      while (this.data.user.gone.indexOf(iidx) != -1) {
        this.data.user.gone.pop(iidx)
      }
      hg['gone'] = this.data.user.gone
      // console.log(this.data.user.gone, iidx)
      for (let i = 0; i < this.data.user.gone.length; ++i) {
        if (iidx != this.data.user.gone[i]) {
          temp.push(this.data.user.gone[i])
        }
      }
      this.data.user.gone = temp
      // console.log('ii',iidx)
      km.del_diaryz(iidx)
    } else {
      // hg['gone'] = _.push(iidx)
      hg['gone'] = this.data.user.gone
      this.data.user.gone.push(iidx)
      let datax = km.empty_diaryz(iidx)
      ++km.globalData.num_diary
      datax["_id"] = String(Number(datax["_id"]) + 1)
      // console.log(datax['_id'])
      db.collection('global').doc('default').update({
        data: {
          num_diary: _.inc(1),
        }
      }).then(res => {
        // console.log('succ')
      }).catch(rws => {
        console.log('fail', rws)
        wx.showToast({
          title: '更新数据失败',
          icon: 'none',
        })
      })
      km.diaryz(datax)
    }
    // console.log('hg', hg)
    db.collection('user').doc(km.globalData.openid).update({
      data: hg
    }).then(res => {
      thee.setData({
        busy: false,
        user: thee.data.user
      })
      km.cb(thee.data.user)
      thee.sele_block({ detail: { value: thee.data.now_block } })
      wx.showToast({
        title: '修改成功！',
      })
    }).catch(rws => {
      thee.setData({
        busy: false,
      })
      console.log('ff', rws)
      wx.showToast({
        title: '修改失败，请重试！',
        icon: 'none',
      })
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
    this.upd()
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