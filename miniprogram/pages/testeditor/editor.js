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
    // xxx: '<p><img data-cloud="cloud://lr580c-6gotth6z00871312.6c72-lr580c-6gotth6z00871312-1304870229/diary/-1_0.png" width="50%" src="https://6c72-lr580c-6gotth6z00871312-1304870229.tcb.qcloud.la/diary/-1_0.png"></p><p><br></p>',
    s_att_id: -1,
    s_att_name: '',
    s_time: '',
    s_pro: 0,
    s_city: 0,
    s_id_on: false,
    city: [],
    attration: [],
    s_tg: [],
    edit: 0,
    idx: -1,
    newed: false,
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
  input_s_att_name(e) {
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
      edit: options.edit,
    })
    if (options.edit == 0) {
      this.setData({
        now_id: km.globalData.num_diary,
        s_time: km.date2str(new Date()),
      })
      // console.log('inc 1')
      db.collection('global').doc('default').update({
        data: {
          num_diary: _.inc(1)
        }
      })
    } else {
      console.log(options)//, km.globalData.diary)
      var idx = Number(options.id)

      let nr = km.globalData.diary[idx].content
      let img_nr = nr.match(/<img[^>]*>/g)
      console.log(img_nr)

      this.setData({
        now_id: km.globalData.diary[idx]._id,//Number(options.id),
        s_time: km.date2str(new Date(km.globalData.diary[idx]['time'])),
        s_att_id: km.globalData.diary[idx].att_id,
        s_att_name: km.globalData.diary[idx].att_name,
        articleContent: km.globalData.diary[idx].content,
        img_num: img_nr.length,
        idx: idx,
      })
      // var that = this
      // var thee = this
      // setTimeout(() => {
      //   if (thee.data.edit != 0) {
      //     console.log('qwq ,',km.globalData.diary[thee.data.idx].content)
      //     thee.editorCtx.setContents({
      //       html: km.globalData.diary[thee.data.idx].content,
      //     })
      //   }
      // }, 10);

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
            // console.log('wewew/e')
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
    var thee = that
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec(res => {
      if (thee.data.edit != 0) {
        // console.log('qwq ,', km.globalData.diary[thee.data.idx].content)
        thee.editorCtx.setContents({
          html: km.globalData.diary[thee.data.idx].content,
        })
      }
    })//.then(res=>{
    // console.log('123')
    //})

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
            // console.log('succc', hp)
            that.editorCtx.insertImage({
              src: whp,//res.tempFilePaths[0],
              // data: {
              //   id: 'abcd',
              //   role: 'god'
              // },
              width: '50%',
              success: function () {
                // console.log('insert image success')
                that.setData({
                  img_num:1+that.data.img_num,
                })
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
    // console.log(this.data.articleContent)
    // this.setData({
    //   s_att_name
    // })
    if (this.data.s_att_name == '') {
      if (this.data.s_att_id != -1) {
        this.setData({
          s_att_name: km.globalData.attration[Number(this.data.s_att_id)].name
        })
      } else {
        this.setData({
          s_att_name: '未知景点'
        })
      }
    }
    // console.log('nr',this.data.articleContent)
    if (this.data.articleContent == '') {
      wx.showToast({
        title: '日志内容不得为空！',
        icon: 'none',
      })
      return
    }

    var thee = this

    if (this.data.edit == 1) {
      // console.log(this.data.edit, this.data.idx)
      this.setData({
        now_id: km.globalData.diary[thee.data.idx]._id
      })
    }
    // console.log('qwq', this.data.s_att_name, this.data.s_att_id, this.data.now_id)
    var datax = km.empty_diaryz(this.data.s_att_id, this.data.s_att_name, this.data.edit)
    datax['content'] = this.data.articleContent
    if (this.data.edit == 1) {
      datax['time'] = km.globalData.diary[this.data.idx]['time']
      datax['_id'] = this.data.now_id
    }
    // if(this.data.edit){
    //
    // }
    // console.log(datax)
    km.diaryz(datax, this.data.edit)
    this.setData({
      newed: true,
    })
    wx.navigateBack({
      delta: 0,
    })
  },
  onUnload() {
    if (!this.data.newed && this.data.edit != 1) {
      // console.log('inc -1')
      db.collection('global').doc('default').update({
        data: {
          num_diary: _.inc(-1)
        }
      })
    }
  },
})
