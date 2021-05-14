var f_city = new Array();
const km=getApp();
Page({
  onLoad: function (options) {
    console.log(km.globalData.city)
    for(var i = 0;i<km.globalData.city.length;i++)
    {
      console.log('test')
      console.log(km.globalData.city[i].name)
      f_city[i] = km.globalData.city[i].name
    }
  },
 
  data: {
    index: 0,
    multiArray: [['广东省'], [f_city]],
    multiIndex: [0, 0],
  },
  bindMultiPickerChange: function (e) {
    console.log(f_city)
    console.log(km.globalData.city)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    data.multiArray[1] = f_city;
    this.setData(data);
  
  }
})