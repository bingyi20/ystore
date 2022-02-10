
import countdownStore from "../../store/countdown-store"

// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {},
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    // 将page与store进行绑定
    countdownStore.bind('countdown', this)
    // 启动倒计时
    countdownStore.init(Date.now() + 28 * 3600 * 1000)
  },
  unOnload() {
    countdownStore.remove(this)     // 需要进行内存销毁
    countdownStore.destroy()        // 自定义销毁
  }
})
