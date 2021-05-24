//app.js
// var mejs = require('/pages/Me/Me.js')
const cmp = function () {
  return function (a, b) {
    return Number(a['_id']) - Number(b['_id'])
  }
}
App({
  onLaunch: function () {
    wx.setEnableDebug({
      enableDebug: true
    }).then(res => {
      // console.log(res)
    }).catch(rws => {
      console.log('www', rws)
    })
    //this.globalData.user = null
    //this.globalData.openid = null
    const km = this//this
    var load_a = false, load_b = false
    var deload = function () {
      if (load_a && load_b) {
        wx.hideLoading({
          success: (res) => { },
        })
      }
    }
    km.cb = function () { }
    const deban = true //加载失败后是否解除禁用状态
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
        env: 'lr580c-6gotth6z00871312',
      }).then(req => {
        wx.showLoading({
          title: '加载中……',
          mask: true, //有待商榷
        })

        const db = wx.cloud.database()
        const _ = db.command
        // const km = getApp() //or this in app.js

        db.collection('global').doc('default').get().then(res => {
          // console.log(res.data)
          km.globalData.num_city = res.data.num_city
          km.globalData.num_province = res.data.num_province
          km.globalData.num_attration = res.data.num_attration
          km.globalData.num_diary = res.data.num_diary

          const epoch = 20
          const batch_city = Math.ceil(res.data.num_city / epoch)
          const batch_province = Math.ceil(res.data.num_province / epoch)
          const batch_attration = Math.ceil(res.data.num_attration / epoch)


          var city_obj = []
          var attration_obj = []
          var province_obj = []
          var finish_deal = function () {
            // console.log('qwq')
            province_obj.sort(cmp())
            city_obj.sort(cmp())
            attration_obj.sort(cmp())
            km.globalData.province = province_obj
            km.globalData.city = city_obj
            km.globalData.attration = attration_obj
            // console.log(km.globalData)

            // console.log(province_obj)
            // console.log(city_obj)
            // console.log(attration_obj)
            // console.log()
            // wx.hideLoading()
            load_a = true
            deload()
          }
          var progress_bar = 0
          var tot_progress_bar = batch_city + batch_province + batch_attration

          for (let i = 0; i < batch_city; ++i) {
            var this_batch = []
            for (let j = i * epoch; j < Math.min(res.data.num_city, i * epoch + epoch); ++j) {
              this_batch.push(String(j))
            }
            // console.log(this_batch)
            db.collection('city').where({ _id: _.in(this_batch) }).get().then(rea => {
              // console.log(rea)
              for (let i = 0; i < rea.data.length; ++i) {
                city_obj.push(rea.data[i])
              }
              if (++progress_bar == tot_progress_bar) {
                finish_deal()
              }
            }).catch(rwa => {
              wx.showToast({
                title: '读取城市数据失败，请检查您的网络并重新进入程序！',
                icon: 'none',
              })
              if (deban) wx.hideLoading()
            })
          }

          for (let i = 0; i < batch_province; ++i) {
            var this_batch = []
            for (let j = i * epoch; j < Math.min(res.data.num_province, i * epoch + epoch); ++j) {
              this_batch.push(String(j))
            }
            // console.log(this_batch)
            db.collection('province').where({ _id: _.in(this_batch) }).get().then(rea => {
              // console.log(rea)
              for (let i = 0; i < rea.data.length; ++i) {
                province_obj.push(rea.data[i])
              }
              if (++progress_bar == tot_progress_bar) {
                finish_deal()
              }
            }).catch(rwa => {
              wx.showToast({
                title: '读取省份数据失败，请检查您的网络并重新进入程序！',
                icon: 'none',
              })
              if (deban) wx.hideLoading()
            })
          }

          for (let i = 0; i < batch_attration; ++i) {
            var this_batch = []
            for (let j = i * epoch; j < Math.min(res.data.num_attration, i * epoch + epoch); ++j) {
              this_batch.push(String(j))
            }
            // console.log(this_batch)
            db.collection('attration').where({ _id: _.in(this_batch) }).get().then(rea => {
              // console.log(rea)
              for (let i = 0; i < rea.data.length; ++i) {
                attration_obj.push(rea.data[i])
              }
              if (++progress_bar == tot_progress_bar) {
                finish_deal()
              }
            }).catch(rwa => {
              wx.showToast({
                title: '读取景点数据失败，请检查您的网络并重新进入程序！',
                icon: 'none',
              })
            })
            if (deban) wx.hideLoading()
          }


        }).catch(rws => {
          console.log(rws)
          wx.showToast({
            title: '获取数据失败，请检查您的网络',
            icon: 'none',
          })
          if (deban) wx.hideLoading()
        })

        wx.cloud.callFunction({ //点击过快切换到探索区有小概率会导致产生bugs，暂不打算修复
          name: 'getOpenId',
        }).then(res => {
          // console.log('operes',res)

          wx.showLoading({
            title: '载入用户信息',
            mask: true,
          })
          var openid = res.result.userInfo.openId
          km.globalData.openid = openid
          // console.log('open id', openid)

          // thee.qabo(openid)

          db.collection('user').doc(openid).get().then(ret => {
            if (km.jump_to_main) {
              km.jump_to_main()
            }
            km.globalData.user = ret.data
            km.cb(ret.data)//而不是km.fn，因为fn是绑定cb……cb才是执行函数
            var bar = 0
            const epoch = 20
            const batch = Math.ceil(ret.data.diary.length / epoch)
            var obj_diary = []
            // console.log('bb',batch, ret.data.diary)
            const tot_bar = batch

            var fin_rdiary = function () {
              obj_diary.sort(cmp())
              obj_diary.reverse()
              km.globalData.diary = obj_diary
              // console.log('??',obj_diary)
              load_b = true
              deload()
              // wx.hideLoading({
              //   success: (res) => { },
              // })
              // console.log('sssuc', km.globalData.diary)
            }
            if (tot_bar == 0) { fin_rdiary() }
            for (let i = 0; i < batch; ++i) {
              var temp = []
              for (let j = i * epoch; j < Math.min(epoch * (i + 1), ret.data.diary.length); ++j) {
                temp.push(String(ret.data.diary[j]))
              }
              // console.log('tt',temp)
              db.collection('diary').where({ _id: _.in(temp) }).get().then(rea => {
                // console.log(rea.data)
                for (let k = 0; k < rea.data.length; ++k) {
                  obj_diary.push(rea.data[k])
                }
                if (++bar == tot_bar) fin_rdiary()
              }).catch(rwa => {
                if (deban) wx.hideLoading({
                  success: (res) => { },
                })
                console.log('读取日志失败', rwa)
                wx.showToast({
                  title: '读取心路板块数据失败',
                  icon: 'none',
                })
              })
            }
            // wx.hideLoading({
            //   success: (res) => { },
            // })
          }).catch(rwt => {
            if (km.remain_init) {
              km.remain_init()
            }
            km.globalData.user = null
            console.log('用户尚未授权过头像和昵称。')
            // console.log(rwt)
            if (deban) wx.hideLoading({
              success: (res) => { },
            })
          })

        }).catch(rws => {
          // console.log('broke down',rws)
          wx.showToast({
            title: '请求获取用户信息失败！',
            icon: 'none',
          })
        })
      }).catch(rwq => {
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
        })
      })
    }



    this.globalData = {
      pathc: 'cloud://lr580c-6gotth6z00871312.6c72-lr580c-6gotth6z00871312-1304870229/',
      //openid: null,
      diary: [],
      city: [],
      province: [],
      attration: [],
      //user: null,
    }
  },

  fn: function (cb) {
    this.cb = cb
  },

  fn2: function (cb2) {
    this.cb2 = cb2
  },

  fn3: function (cb3) {
    this.cb3 = cb3
  },
  // hg:function(v){
  //   this.v=v
  //   if(this.cb!=null){
  //     this.cb(v)
  //   }
  // }

  empty_diaryz: function (idx, nam) {
    // console.log('ts',idx,nam)
    if (idx == -1) {
      if (nam == undefined) {
        nam = '景点'
      }
    }
    else if (nam == undefined) {
      nam = this.globalData.attration[idx].name
    }
    // console.log('ts',idx,nam)
    var obj = {}
    obj['time'] = new Date()
    obj['_id'] = String(this.globalData.num_diary)
    obj['user'] = this.globalData.openid
    obj['att_id'] = idx
    obj['att_name'] = nam
    obj['content'] = ''
    // console.log('generated', obj)
    return obj
  },

  cb2(x) {

  },

  diaryz: function (datax, edit) {
    // datax['_id'] = Number(datax['_id'])
    // console.log('wwwwww', datax, edit)
    const db = wx.cloud.database()
    const deban = true
    const km = this
    const _ = db.command
    var bar = 0

    const tot_bar = 2
    var fin = function () {
      // console.log('fff')
      if (edit != 1) km.globalData.num_diary++
      km.cb2()//km.globalData.user
      // console.log('qwq',km.globalData.user)
      wx.hideLoading({
        success: (res) => { },
      })
    }
    wx.showLoading({
      title: '更新中',
      mask: true,
    })
    // var gg = (Number(edit != 1))
    // console.log('gg', gg)
    // db.collection('global').doc('default').update({
    //   data: {
    //     num_diary: _.inc(gg)
    //   }
    // }).then(res => {
    //   // ++bar
    //   // console.log('g',bar)
    //   if (++bar == tot_bar) { fin() }
    // }).catch(rws => {
    //   console.log('gF', rws)
    //   wx.showToast({
    //     title: '更新数据失败！',
    //     icon: 'none',
    //   })
    //   if (deban) wx.hideLoading({
    //     success: (res) => { },
    //   })
    // })

    if (1) { //datax['att_id'] != -1
      if (edit != 1) km.globalData.user.diary.push(km.globalData.num_diary)
      var newgone = []
      if (edit == 1) {
        var still = false
        var tgi = -1
        for (let i = 0; i < km.globalData.diary.length; ++i) {
          if (km.globalData.diary[i]['_id'] == datax['_id']) {
            tgi = i
            break
          }
        }
        // console.log(km.globalData.diary[tgi])
        for (let i = 0; i < km.globalData.diary.length; ++i) {
          if (tgi == i) { continue } //datax['_id']
          if (km.globalData.diary[i]['att_id'] == km.globalData.diary[tgi]['att_id']) {//datax['att_id']) {
            still = true
            break
          }
        }
        // console.log('st1', still)
        // if (datax['att_id'] == -1) { still = true }
        // console.log('st2', still)
        // if(still) {gone=km.globalData.user.gone}
        // else 
        if (!still) {
          km.globalData.user.gone.splice(km.globalData.user.gone.indexOf(km.globalData.diary[tgi]['att_id']), 1)
        }
        if (km.globalData.user.gone.indexOf(datax['att_id']) == -1) {
          km.globalData.user.gone.push(datax['att_id'])
        }
        newgone = km.globalData.user.gone
      } else {
        newgone = km.globalData.user.gone
        if (newgone.indexOf(datax['att_id']) == -1) {
          newgone.push(datax['att_id'])
        }
      }
      km.globalData.user.gone = newgone
      var diaryhg
      if (edit != 1) {
        diaryhg = _.push(km.globalData.num_diary)
      } else {
        diaryhg = km.globalData.user.diary
      }
      db.collection('user').doc(String(km.globalData.openid)).update({
        data: {
          diary: diaryhg,
          gone: newgone,
        }
      }).then(res => {
        // console.log('u',bar)
        if (++bar == tot_bar) { fin() }
      }).catch(rws => {
        console.log('uF', rws)
        wx.showToast({
          title: '更新数据失败！',
          icon: 'none',
        })
        if (deban) wx.hideLoading({
          success: (res) => { },
        })
      })
    } else {
      if (++bar == tot_bar) { fin() }
    }

    if (edit != 1) km.globalData.diary.unshift(datax)
    if (edit == 1) {
      km.globalData.diary[tgi]['att_id'] = datax['att_id'] //String()
      km.globalData.diary[tgi]['att_name'] = datax['att_name']
      km.globalData.diary[tgi]['content'] = datax['content']
      var __id = datax['_id']
      delete datax['_id']
      db.collection('diary').doc(__id).update({
        data: datax,
      }).then(res => {
        // console.log('dbuntu', bar, __id)
        if (++bar == tot_bar) { fin() }
      }).catch(rws => {
        console.log('dF', rws)
        wx.showToast({
          title: '更新数据失败！',
          icon: 'none',
        })
        if (deban) wx.hideLoading({
          success: (res) => { },
        })
      })
    } else {
      db.collection('diary').add({
        data: datax,
      }).then(res => {
        // console.log('d',bar)
        if (++bar == tot_bar) { fin() }
      }).catch(rws => {
        console.log('dF', rws)
        wx.showToast({
          title: '更新数据失败！',
          icon: 'none',
        })
        if (deban) wx.hideLoading({
          success: (res) => { },
        })
      })
    }
  },

  del_diaryz(idx) {
    const db = wx.cloud.database()
    const deban = true
    const km = this
    const _ = db.command

    wx.showLoading({
      title: '更新中……',
    })
    // console.log(idx)
    var temp_ud = []
    var temp_d = []
    var del_id = []
    for (let i = 0; i < km.globalData.diary.length; ++i) {
      let ii = Number(km.globalData.diary[i]._id)
      // console.log(i, ii, idx, km.globalData.diary[i].att_id, km.globalData.diary[i].content)
      if (idx == km.globalData.diary[i].att_id && km.globalData.diary[i].content == '') {
        del_id.push(ii)
      } else {
        temp_d.push(km.globalData.diary[i])
      }
    }
    // console.log('s1', temp_d, del_id)
    for (let i = 0; i < km.globalData.user.diary.length; ++i) {
      let save = true
      let ii = km.globalData.user.diary[i]
      for (let j = 0; j < del_id.length; ++j) {
        if (ii == del_id[j]) {
          save = false
          break
        }
      }
      if (save) {
        temp_ud.push(ii)
      }
    }
    km.globalData.user.diary = temp_ud
    km.globalData.diary = temp_d
    // console.log('s2', temp_ud, km.globalData.user.diary, km.globalData.diary)
    db.collection('user').doc(km.globalData.openid).update({
      data: {
        diary: temp_ud
      }
    }).then(res => {
      wx.hideLoading({
        success: (res) => { },
      })
    }).catch(rws => {
      wx.showToast({
        title: '数据更新失败！',
        icon: 'none',
      })
      // console.log('del_diary', rws)
      if (deban) wx.hideLoading({
        success: (res) => { },
      })
    })
  },

  date2str(x) {
    let s = '', t = ''
    s += String(x.getFullYear())
    s += '/'
    t = String(x.getMonth() + 1)
    if (t.length < 1) { s += '0' + t }
    else { s += t }
    s += '/'
    t = String(x.getDate())
    if (t.length < 1) { s += '0' + t }
    else { s += t }
    // console.log(x,s)
    return s
  },
})
