//app.js
// var mejs = require('/pages/Me/Me.js')
App({
  onLaunch: function () {
    const km = this//this
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

          const epoch = 20
          const batch_city = Math.ceil(res.data.num_city / epoch)
          const batch_province = Math.ceil(res.data.num_province / epoch)
          const batch_attration = Math.ceil(res.data.num_attration / epoch)
          const deban = true //加载失败后是否解除禁用状态
          const cmp = function () {
            return function (a, b) {
              return Number(a['_id']) - Number(b['_id'])
            }
          }
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
            wx.hideLoading()
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
          // console.log('res',res)
          var openid = res.result.userInfo.openId
          km.globalData.openid = openid
          console.log('open id', openid)

          // thee.qabo(openid)

          db.collection('user').doc(openid).get().then(ret => {
            km.globalData.user = ret.data
            km.cb(ret.data)//而不是km.fn，因为fn是绑定cb……cb才是执行函数
          }).catch(rwt => {
            km.globalData.user = null
            console.log('用户尚未授权过头像和昵称。')
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
      openid:null,
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
})
