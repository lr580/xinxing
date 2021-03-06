const app = getApp()
const km = getApp()
import lottie from 'lottie-miniprogram'
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    unRegistered: true,
    user: null,
    editi_motto: false,
    s_motto: '',
  },

  onLoad: function () {


    this.setData({
      unRegistered: getApp().globalData.user == null
    })
    if (this.data.unRegistered) {
      wx.createSelectorQuery().selectAll('#c1').node(res => {
        const canvas = res[0].node
        const context = canvas.getContext('2d')

        canvas.width = 1000
        canvas.height = 1000

        lottie.setup(canvas)
        this.ani = lottie.loadAnimation({
          loop: true,
          autoplay: true,
          animationData: require('../lotties/signup'),
          rendererSettings: {
            context,
          },
        })
      }).exec()
    }
    else{
      wx.createSelectorQuery().selectAll('#c2').node(res => {
        const canvas = res[0].node
        const context = canvas.getContext('2d')

        canvas.width = 1000
        canvas.height = 1000

        lottie.setup(canvas)
        this.ani = lottie.loadAnimation({
          loop: true,
          autoplay: true,
          animationData: require('../lotties/uh'),
          rendererSettings: {
            context,
          },
        })
      }).exec()
    }

    const thee = this
    // }).then(res=>{
    //   console.log(res)
    // }).catch(rws=>{
    //   console.log('qwq',rws)
    // })
    // this.initAll()
    // wx.showLoading({
    //   title: '加载中……',
    // })

    // for (let i = 101; i <= 154; ++i) {
    //   db.collection('diary').doc(String(i)).remove().then(res => {
    //     console.log('suc', i)
    //   }).catch(rws => {
    //     console.log('rws', i, rws)
    //   })
    // }

    app.fn(
      function (x) {
        thee.setData({
          unRegistered: x == null,
          user: x,
          s_motto: x == null ? '' : x.motto,
        })
      }
    )

    /*app.fn2(
      function (x,y) {
        
      }
    )*/

    return
    // wx.cloud.callFunction({
    //   name: 'getOpenId',
    // }).then(res => {
    //   // console.log('res',res)
    //   var openid = res.result.userInfo.openId
    //   console.log('open id', openid)
    //   // thee.qabo(openid)
    // }).catch(rws => {
    //   console.log('shit it broke down', rws)
    //   wx.showToast({
    //     title: '请求获取用户信息失败！',
    //     icon: 'none',
    //   })
    // }) //aaaa
  },

  qabo(openid) {
    const thee = this
    const km = getApp()
    wx.getUserProfile({
      desc: '请授权获取您的昵称和头像',
      success: function (res) {
        // console.log('why', res)
        // console.log('oks', res.userInfo)
        // const {userinfo} = res
        // console.log(userinfo)
        // thee.setData({user})
        // console.log(thee.data)
        // thee.binduser

        var datax = {
          '_id': app.globalData.openid,
          city: res.userInfo.city,
          province: res.userInfo.province,
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          like: [],
          dislike: [],
          gone: [],
          diary: [],
          motto: '',
        }

        // datax['_id'] = km.globalData.openid
        // console.log(datax, km.globalData.openid)
        db.collection('user').add({
          data: datax
        }).then(rec => {
          // console.log('reccccccccc', rec)
          // app.cb(rec.data)
          thee.setData({
            unRegistered: false,
            user: datax,
          })
          km.globalData.user = datax
        }).catch(rwc => {
          console.log('err', rwc)
          wx.showToast({
            title: '存储用户信息失败，请重试！',
            icon: 'none',
          })
        })

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

  onShow() {
    // console.log('qwq')
    km.cb(km.globalData.user)
  },

  // upd_af_init(){

  // },

  initAll: function () {//废置
    return
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

  to_myattra() {
    if (this.data.user == null) {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/myattra/myattra',
    })
  },

  to_advice() {
    wx.navigateTo({
      url: '/pages/advice/advice',
    })
  },

  to_help() {
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },

  edit_motto() {
    this.setData({
      editi_motto: true,
    })
  },

  save_motto() {
    this.setData({
      editi_motto: false,
    })
    if (this.data.s_motto.trim() == '') {
      // console.log('qwq')
      wx.showToast({
        title: '请不要设置空白的个性签名！',
        icon: 'none',
      })
      return
    }
    km.globalData.user.motto = this.data.s_motto
    km.cb(km.globalData.user)
    var thee = this
    db.collection('user').doc(String(km.globalData.openid)).update({
      data: {
        motto: thee.data.s_motto
      }
    }).then(res => {

    }).catch(rws => {
      console.log('F i motto sav', rws)
      wx.showToast({
        title: '保存失败！',
        icon: 'none',
      })
    })
  },

  input_s_motto(e) {
    this.setData({
      s_motto: e.detail.value,
    })
  },

})

module.exports = {
  Page: Page,
}
