const km = getApp()
// import lottie from 'lottie-miniprogram'
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    articleContent: '', //文章正文
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    img_num: 0,//当前图片数目
    now_id: -1,
    xxx: '<p><img data-cloud="cloud://lr580c-6gotth6z00871312.6c72-lr580c-6gotth6z00871312-1304870229/diary/-1_0.png" width="50%" src="https://6c72-lr580c-6gotth6z00871312-1304870229.tcb.qcloud.la/diary/-1_0.png"></p><p><br></p>',
    s_att_id: -1,
    s_att_name: '',
    s_time: '',
    s_pro: 0,
    s_city: 0,
    s_id_on: false,
    city: [],
    attration: [],
    s_tg: [],
  },
  id_onz() {
    this.setData({
      s_id_on: !this.data.s_id_on,
    })
  },
  id_offz() {
    this.setData({
      s_id_on: !this.data.s_id_on,
    })
  },
  sele_prov(p) {
    var pv = Number(p.detail.value)
    this.setData({
      s_pro: pv,
    })
    if (pv == -1) {
      this.setData({
        s_att_id: -1,
      })
    }
  },
  sele_city(p) {
    var pv = Number(p.detail.value)
    this.setData({
      s_city: pv,
    })
    // console.log('q', this.data.s_city)
    var temp = []
    for (let i = 0; i < km.globalData.attration.length; ++i) {
      if (km.globalData.attration[i].belong == pv) {
        temp.push(i)
      }
    }
    // console.log(temp)
    this.setData({
      s_tg: temp,
    })
  },
  sele_attra(p) {
    var pv = Number(p.detail.value)
    this.setData({
      s_att_id: pv,
    })
    // console.log('qqq', this.data.s_att_id)
  },
  input_s_att_name(e){
    this.setData({
      s_att_name: e.detail.value,
    })
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(options) {
    this.setData({
      city: km.globalData.city,
      attration: km.globalData.attration,
    })
    if (options.edit == 0) {
      this.setData({
        now_id: km.globalData.num_diary,
        s_time: km.date2str(new Date()),
      })
    } else {
      this.setData({
        now_id: Number(options.id),
      })
    }
    console.log(this.data.now_id)
    this.sele_city({ detail: { value: 0 } })

    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
    })

  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()

  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        // console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        // console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      fail(rws) {
        wx.showToast({
          title: '上传失败！',
          icon: 'none',
        })
      },
      success: function (res) {
        var tempPath = res.tempFilePaths
        var tempf = tempPath[0].split('.')
        var suffix = tempf[tempf.length - 1]
        var hp = 'diary/' + String(that.data.now_id) + '_' + String(that.data.img_num) + '.' + suffix
        var whp = km.globalData.pathc + hp
        console.log(tempf, whp)
        if (tempPath.length <= 0) {
          wx.showToast({
            title: '你没有选中图片！',
            icon: 'none',
          })
          return
        }
        wx.showLoading({
          title: '上传中',
        })
        wx.cloud.uploadFile({
          filePath: res.tempFilePaths[0],
          cloudPath: hp,
          success: function (ret) {
            console.log('succc', hp)
            that.editorCtx.insertImage({
              src: whp,//res.tempFilePaths[0],
              // data: {
              //   id: 'abcd',
              //   role: 'god'
              // },
              width: '50%',
              success: function () {
                // console.log('insert image success')
                wx.hideLoading({
                  success: (res) => { },
                })
              },
              fail(rws) {
                wx.showToast({
                  title: '载入失败！',
                  icon: 'none',
                })
                wx.hideLoading({
                  success: (res) => { },
                })
              },
            })
            wx.hideLoading({
              success: (res) => { },
            })
          },
          fail: function (rwt) {
            wx.showToast({
              title: '上传失败！',
              icon: 'none',
            })
            wx.hideLoading({
              success: (res) => { },
            })
          },
        })
      }
    })
  },
  getEditorValue(e) {
    this.setData({
      articleContent: e.detail.html
    })
    // console.log(e.detail.html)
  },
  mytj() {
    console.log(this.data.articleContent)
    // this.setData({
    //   s_att_name
    // })
    console.log('qwq', this.data.s_att_name, this.data.s_att_id)
    var datax = km.empty_diaryz(this.data.s_att_id, this.data.s_att_name)
    datax['content'] = this.data.articleContent
    km.diaryz(datax)
    wx.navigateBack({
      delta: 0,
    })
  }
})
