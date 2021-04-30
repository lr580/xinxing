//app.js
App({
  onLaunch: function () {
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
      }).then(req => {
        
      })
      const db = wx.cloud.database()
      const _ = db.command;
      db.collection('city').doc('default').get().then(res => {
        console.log(res.data)
        this.globalData.num_city = res.data.num_city
        this.globalData.num_province = res.data.num_province
        this.globalData.num_attration = res.data.num_attration
      }).catch(rws=>{
        wx.showToast({
          title: 'error',
          icon:'none',
        })
      })

    }

    this.globalData = {
      pathc: 'cloud://lr580c-6gotth6z00871312.6c72-lr580c-6gotth6z00871312-1304870229/',
    }
  }
})
