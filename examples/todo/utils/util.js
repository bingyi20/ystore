const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}


// TODO 需要做不同平台的兼容实现
const cheersAudio = wx.createInnerAudioContext()
cheersAudio.src = "https://696e-inside-9g12h17a0fe64778-1310103335.tcb.qcloud.la/audio/cheers.mp3?sign=5efc49f40cdc9b06213402a8ee10bbfc&t=1646990304"
const cheers = () => {
  cheersAudio.seek(0)
  cheersAudio.play()
}

module.exports = {
  formatTime,
  cheers
}
