let touchDotX = 0; //X按下时坐标
let touchDotY = 0; //y按下时坐标
let BALLTOP = 30;
import lottie from 'lottie-miniprogram'
const km = getApp()
const db = wx.cloud.database()
const _ = db.command
var lottieState = false;
Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
    isFront1: true,
    isFront2: true,
    isFront3: true,
    animationData1: {},
    animationData2: {},
    animationData3: {},
    ballTop1: BALLTOP,
    ballTop2: 230,
    ballTop3: 220,
    ballWidth1: 680,
    ballWidth2: 640,
    ballWidth3: 605,
    index1: 3,
    index2: 2,
    index3: 1,
    statusBarHeight: getApp().globalData.statusBarHeight,

    sele_on: false,
    city: [],//city对象指针
    attration: [],
    now_city: 0,//现在选择的city的_id
    now_attration: [],
    front: -1,//当前能看到的景点卡片_id，-1代表无
    tips: [''],
    now_tips: '',
  },
  onLoad(options) {
    this.update_sele()
    this.init_tips()
    wx.createSelectorQuery().selectAll('#like').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 1000
      canvas.height = 1000

      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: false,
        autoplay: true,
        animationData: require('../lotties/dislike'),
        rendererSettings: {
          context,
        },
      })
    }).exec()
    wx.createSelectorQuery().selectAll('#dislike').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 1000
      canvas.height = 1000

      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: false,
        autoplay: true,
        animationData: require('../lotties/like'),
        rendererSettings: {
          context,
        },
      })
    }).exec()
  },
  onShow(options) {
    this.switch_tip()
  },
  init_tips() {
    var t = [
      ['身未动，心已远。'],
      ['梦想，并不奢侈，只要勇敢地迈出第一步。'],
      ['一个人的旅行，在路上遇见最真实的自己。'],
      ['旅行要学会随遇而安，淡然一点，走走停停。'],
      ['一辈子是场修行，短的是旅行，长的是人生。'],
      ['当遗忘变成另一种开始，我踏出了旅途的第一步!'],
      ['要么读书要么旅行，灵魂和身体，必须有一个在路上。'],
      ['因为有梦，所以勇敢出发，选择出发，便只顾风雨兼程。'],
      ['每个人心中，都会有一个古镇情怀，流水江南，烟笼人家。'],
      ['一颗说走就走的心，一个会拍照的情侣，一段甜蜜的旅程。'],
      ['旅行的理由不需要阐述太多，一个字就可以概括全部：走。'],
      ['出去旅行，不是去看风景，而是去寻回自己——最本真的自己。'],
      ['我们一路上兴致勃勃地参观，当夕阳西下时，才恋恋不舍地离开。'],
      ['山河远阔，人间烟火'],
      ['江南好，风景旧曾谙。'],
      ['两人一马，明日天涯。'],
      ['走走停停，也是美景。'],
      ['智者爱水，仁者爱山。'],
      ['山虽无言，然非无声。'],
      ['惟愿我闲山未老，踏月寻闲老青山。'],
      ['为君持酒劝斜阳，且向花间留晚照。'],
      ['听说远方很美，你不要怕天黑'],
      ['世界是一本书，不旅行的人只看到其中的一页。'],
      ['背包，相机，目的地，下一站，我不告诉你~'],
      ['一个背包，几本书，所有喜欢的歌，一张单程车票，一颗潇洒的心。'],
    ]
    this.setData({
      tips: t,
    })
    this.switch_tip()
  },
  switch_tip() {
    let thee = this
    var nr
    do {
      let idx = Math.floor(thee.data.tips.length * Math.random())
      nr = thee.data.tips[idx]
    } while (nr == thee.data.now_tips)
    this.setData({
      now_tips: nr,
    })
  },
  tabSelect(e) {
    console.log(e)
    this.setData({
      sele_on: false,
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      now_city: Number(e.currentTarget.dataset.id)
    })
    this.load_attration()
  },
  tabSelect1(e) {
    this.setData({
      sele_on: false,
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      now_province: Number(e.currentTarget.dataset.id)
    })
    this.load_attration()
  },
  update_sele() {
    // console.log(this.data.city)
    // var tcopy=[]
    const km = getApp().globalData
    // for(let i=0;i<km.city.length;++i){
    //   tcopy.push(km.city[i])
    // }
    this.setData({
      province: km.province,
      city: km.city,
      attration: km.attration,
    })
    if (this.data.province.length) {
      // this.data.city[0].checked = true
      this.setData({
        now_city: 0,
        sele_on: false,
      })
    }
    this.load_attration()
    // console.log(this.data.city,getApp().globalData.city)
  },

  sele_city(p) {
    // console.log(p.detail.value)
    this.data.now_city = Number(p.detail.value)
    // this.data.sele_on = false
    this.setData({
      sele_on: false,
      now_city: Number(p.detail.value),
    })
    this.load_attration()
  },

  load_attration() {
    function shuffle(arr) {
      let i = arr.length;
      while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
      }
    }

    var now_city = this.data.now_city
    // console.log('nc', now_city)
    var cor = []
    for (let i = 0; i < km.globalData.num_attration; ++i) {
      // console.log(km.globalData.attration[i].belong)
      // console.log('kmnm',km.globalData.user)
      if (km.globalData.attration[i].belong == now_city) {
        if (km.globalData.user != null) {
          if (km.globalData.user.like.indexOf(i) != -1 || km.globalData.user.dislike.indexOf(i) != -1
            || km.globalData.user.gone.indexOf(i) != -1) {
            continue
          }
        }
        cor.push(i)
      }
    }
    // console.log(cor)
    shuffle(cor)
    cor.push(-1)
    // console.log(cor)
    // console.log(cor)
    this.setData({
      now_attration: cor,
      front: cor[0],
    })
    // console.log('qwq')
  },

  sele_range() {
    // console.log('123',x)
    var x = this.data.sele_on
    console.log(x)
    this.setData({ sele_on: !x })
  },

  next_attration() {
    if (this.data.now_attration.length == 1) {
      return
    }
    var temp = this.data.now_attration.slice(1,)
    var idx = -1
    if (temp.length != 0) {
      idx = temp[0]
    }
    this.setData({
      now_attration: temp,
      front: idx,
    })
    // console.log('last', idx, temp)
  },

  go_skip() {
    if (this.data.now_attration.length != 1) {
      this.next_attration()
    }
    else {
      wx.showToast({
        title: '当前已经没有待发现的景点了',
        icon: 'none',
      })
    }
  },

  go_left() {

    var front = Number(this.data.front)
    if (front != -1) {
      if (km.globalData.user != null) { km.globalData.user.dislike.push(front) }
      db.collection('user').doc(km.globalData.openid).update({
        data: {
          dislike: _.push(front)
        }
      }).then(res => {
        //console.log('suc')
        //km.cb()
        km.cb(km.globalData.user)
      }).catch(rws => {
        if (km.user == null) {
          console.log('用户未登录')
          return
        }
        wx.showToast({
          title: '存储用户记录失败！',
          icon: 'none',
        })
      })
    }
    this.next_attration()
  },

  go_right() {

    var front = Number(this.data.front)
    // console.log('ef', front)
    if (front != -1) {
      if (km.globalData.user != null) { km.globalData.user.like.push(front) }
      db.collection('user').doc(km.globalData.openid).update({
        data: {
          like: _.push(front)
        }
      }).then(res => {
        km.cb(km.globalData.user)
      }).catch(rws => {
        if (km.user == null) {
          console.log('用户未登录')
          return
        }
        wx.showToast({
          title: '存储用户记录失败！',
          icon: 'none',
        })
      })
    }
    this.next_attration()
  },

  /**
   *  卡片1手势
   */
  touchstart1: function (event) {
    touchDotX = event.touches[0].pageX; // 获取触摸时的原点
    touchDotY = event.touches[0].pageY;
    // console.log("起始点的坐标X:" + touchDotX);
    // console.log("起始点的坐标Y:" + touchDotY);

  },
  // 移动结束处理动画
  touchend1: function (event) {
    // 手指离开屏幕时记录的坐标
    let touchMoveX = event.changedTouches[0].pageX;
    let touchMoveY = event.changedTouches[0].pageY;
    // 起始点的坐标(x0,y0)和手指离开时的坐标(x1,y1)之差
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    // 两点横纵坐标差的绝对值
    let absX = Math.abs(tmX);
    let absY = Math.abs(tmY);
    //起始点的坐标(x0,y0)和手指离开时的坐标(x1,y1)之间的距离
    let delta = Math.sqrt(absX * absX + absY * absY);
    // console.log('起始点和离开点距离:' + delta + 'px', absX, absY);
    // 如果delta超过60px（可以视情况自己微调）,判定为手势触发
    lottieState = true

    //lottie动画



    if (delta >= 60) {

      // 如果 |x0-x1|>|y0-y1|,即absX>abxY,判定为左右滑动
      if (absX > absY) {
        // 如更tmX<0，即(离开点的X)-(起始点X)小于0 ，判定为左滑
        if (tmX < 0) {
          // console.log("左滑=====");
          // this.go_left()
          setTimeout(() => {
            this.go_left()
          }, 450);
          // 执行左滑动画
          this.Animation1(-500);
          wx.createSelectorQuery().selectAll('#like').node(res => {
            const canvas = res[0].node
            const context = canvas.getContext('2d')

            canvas.width = 1000
            canvas.height = 1000

            lottie.setup(canvas)
            this.ani = lottie.loadAnimation({
              loop: false,
              autoplay: true,
              animationData: require('../lotties/dislike'),
              rendererSettings: {
                context,
              },
            })
          }).exec()
          lottieState = false
          // 如更tmX>0，即(离开点的X)-(起始点X)大于0 ，判定为右滑
        } else {
          // console.log("右滑=====");
          // this.go_right()
          setTimeout(() => {
            this.go_right()
          }, 450);
          // 执行右滑动画
          this.Animation1(500);
          wx.createSelectorQuery().selectAll('#dislike').node(res => {
            const canvas = res[0].node
            const context = canvas.getContext('2d')

            canvas.width = 1000
            canvas.height = 1000

            lottie.setup(canvas)
            this.ani = lottie.loadAnimation({
              loop: false,
              autoplay: true,
              animationData: require('../lotties/like'),
              rendererSettings: {
                context,
              },
            })
          }).exec()
          lottieState = false
        }
        // 如果 |x0-x1|<|y0-y1|,即absX<abxY,判定为上下滑动
      } else {
        // 如更tmY<0，即(离开点的Y)-(起始点Y)小于0 ，判定为上滑
        if (tmY < 0) {
          // console.log("上滑动=====");
          this.setData({
            isFront1: !this.data.isFront1
          });
          // 如更tmY>0，即(离开点的Y)-(起始点Y)大于0 ，判定为下滑
        } else {
          // console.log("下滑动=====");
          this.setData({
            isFront1: !this.data.isFront1
          });
        }
      }

    } else {
      // console.log("手势未触发=====");
    }

    // 让上一张卡片展现正面（如果之前翻转过的话）
    this.setData({
      isFront3: true,
    });
  },

  /**
   *  卡片2手势
   */
  touchstart2: function (event) {
    touchDotX = event.touches[0].pageX; // 获取触摸时的原点
    touchDotY = event.touches[0].pageY;

    // console.log("起始点的坐标X:" + touchDotX);
    // console.log("起始点的坐标Y:" + touchDotY);

  },
  // 移动结束处理动画
  touchend2: function (event) {
    let touchMoveX = event.changedTouches[0].pageX;
    let touchMoveY = event.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    let absX = Math.abs(tmX);
    let absY = Math.abs(tmY);
    let delta = Math.sqrt(absX * absX + absY * absY);
    // console.log('起始点和离开点距离:' + delta + 'px');
    if (delta >= 60) {
      if (absX > absY) {
        if (tmX < 0) {
          // console.log("左滑=====");
          this.Animation2(-500);
        } else {
          // console.log("右滑=====");
          this.Animation2(500);
        }
      } else {
        if (tmY < 0) {
          // console.log("上滑动=====");
          this.setData({
            isFront2: !this.data.isFront2
          });
        } else {
          // console.log("下滑动=====");
          this.setData({
            isFront2: !this.data.isFront2
          });
        }

      }
    } else {
      // console.log("手势未触发=====");
    }

    this.setData({
      isFront1: true,
    });

  },

  /**
   *  卡片3手势
   */
  touchstart3: function (event) {
    touchDotX = event.touches[0].pageX; // 获取触摸时的原点
    touchDotY = event.touches[0].pageY;
    // console.log("起始点的坐标X:" + touchDotX);
    // console.log("起始点的坐标Y:" + touchDotY);
  },
  // 移动结束处理动画
  touchend3: function (event) {
    let touchMoveX = event.changedTouches[0].pageX;
    let touchMoveY = event.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    let absX = Math.abs(tmX);
    let absY = Math.abs(tmY);
    let delta = Math.sqrt(absX * absX + absY * absY);
    // console.log('起始点和离开点距离:' + delta + 'px');
    if (delta >= 60) {
      if (absX > absY) {
        if (tmX < 0) {
          // console.log("左滑=====");
          this.Animation3(-500);
        } else {
          // console.log("右滑=====");
          this.Animation3(500);
        }
      } else {

        if (tmY < 0) {
          // console.log("上滑动=====");
          this.setData({
            isFront3: !this.data.isFront3
          });
        } else {
          // console.log("下滑动=====");
          this.setData({
            isFront3: !this.data.isFront3
          });
        }
      }
    } else {
      // console.log("手势未触发=====");
    }

    this.setData({
      isFront2: true,
    });

  },

  /**
   * 卡片1:
   * 左滑动右滑动动画
   */
  Animation1: function (translateXX) {
    let animation = wx.createAnimation({
      duration: 680,
      timingFunction: "ease",
    });
    this.animation = animation;

    if (translateXX > 0) {
      this.animation.translateY(0).rotate(20).translateX(translateXX).opacity(0).step();
    } else {
      this.animation.translateY(0).rotate(-20).translateX(translateXX).opacity(0).step();
    }

    this.animation.translateY(0).translateX(0).opacity(1).rotate(0).step({
      duration: 10
    });

    this.setData({
      animationData1: this.animation.export(),
    });

    setTimeout(() => {
      this.setData({
        ballTop1: BALLTOP,
        ballLeft1: -302.5,
        ballWidth1: 605,
        index1: 1,

        ballTop2: 240,
        ballLeft2: -340,
        ballWidth2: 680,
        index2: 3,

        ballTop3: 230,
        ballLeft3: -320,
        ballWidth3: 640,
        index3: 2,

        isFront1: true,
      })

    }, 500);
  },

  /**
   * 卡片2:
   * 左滑动右滑动动画
   */
  Animation2: function (translateXX) {
    let animation = wx.createAnimation({
      duration: 680,
      timingFunction: "ease",
    });

    this.animation = animation;

    if (translateXX > 0) {
      this.animation.translateY(0).rotate(20).translateX(translateXX).opacity(0).step();
    } else {
      this.animation.translateY(0).rotate(-20).translateX(translateXX).opacity(0).step();
    }

    this.animation.translateY(0).translateX(0).opacity(1).rotate(0).step({
      duration: 10
    });

    this.setData({
      animationData2: this.animation.export(),
    });

    setTimeout(() => {
      this.setData({
        ballTop1: 230,
        ballLeft1: -320,
        ballWidth1: 640,
        index1: 2,

        ballTop2: 220,
        ballLeft2: -302.5,
        ballWidth2: 605,
        index2: 1,

        ballTop3: 240,
        ballLeft3: -340,
        ballWidth3: 680,
        index3: 3,
      })
    }, 500)
  },

  /**
   * 卡片3:
   * 左滑动右滑动动画
   */
  Animation3: function (translateXX) {
    let animation = wx.createAnimation({
      duration: 680,
      timingFunction: "ease",
    });

    this.animation = animation;
    if (translateXX > 0) {
      this.animation.translateY(0).rotate(20).translateX(translateXX).opacity(0).step();
    } else {
      this.animation.translateY(0).rotate(-20).translateX(translateXX).opacity(0).step();
    }

    this.animation.translateY(0).translateX(0).opacity(1).rotate(0).step({
      duration: 10
    });

    this.setData({
      animationData3: this.animation.export(),
    });

    setTimeout(() => {
      this.setData({
        ballTop1: 240,
        ballLeft1: -340,
        ballWidth1: 680,
        index1: 3,

        ballTop2: 230,
        ballLeft2: -320,
        ballWidth2: 640,
        index2: 2,

        ballTop3: 220,
        ballLeft3: -302.5,
        ballWidth3: 605,
        index3: 1,
      })
    }, 500);
  },

  // 动效函数
  goLo: function () {
    lottieState = true
    wx.createSelectorQuery().selectAll('#like').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 1000
      canvas.height = 1000

      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: false,
        autoplay: true,
        animationData: require('../lotties/like'),
        rendererSettings: {
          context,
        },
      })
    }).exec()
    lottieState = false
  }
})