const app = getApp()
import lottie from 'lottie-miniprogram'

Page({
  data: {

  },

  onLoad: function() {
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

  },
})
