const app = getApp()
import lottie from 'lottie-miniprogram'

Page({
  data: {

  },

  onLoad: function () {
    wx.createSelectorQuery().selectAll('#c1').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 1000
      canvas.height = 1000

      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData: require('../lotties/meBack'),
        rendererSettings: {
          context,
        },
      })
    }).exec()

    const thee = this
    // }).then(res=>{
    //   console.log(res)
    // }).catch(rws=>{
    //   console.log('qwq',rws)
    // })
    this.initAll()
    wx.cloud.callFunction({
      name:'getOpenId',
    }).then(res=>{
      console.log('res',res)
      var openid = res.result.userInfo.openId
      console.log('open id',openid)
      // thee.qabo(openid)
    }).catch(rws=>{
      console.log('shit it broke down',rws)
      wx.showToast({
        title: '请求获取用户信息失败！',
        icon:'none',
      })
    }) //aaaa
  },

  qabo(openid) {
    const thee = this
    wx.getUserProfile({
      desc: '请授权获取您的昵称和头像',
      success: function (res) {
        console.log('why', res)
        console.log('why', res.rawData)
        const userinfo = res
        thee.setData({user})
        // thee.binduser
      },
      fail: function (rws) {
        // console.log('sh', rws)
        wx.showToast({
          title: '温馨提示：若不登录，将无法正常使用本程序的心路功能。',
          icon: 'none',
          duration: 3000,
        })
      }
    })
  },

  initAll: function () {//废置
    const db = wx.cloud.database()
    const _ = db.command;
    const km = getApp()
    db.collection('global').doc('default').get().then(res => {
      console.log(res.data)
      km.globalData.num_city = res.data.num_city
      km.globalData.num_province = res.data.num_province
      km.globalData.num_attration = res.data.num_attration
    }).catch(rws => {
      console.log(rws)
      wx.showToast({
        title: 'error',
        icon: 'none',
      })
    })
  },
})
