
import EventEmitter from "eventemitter3"

// 倒计时状态
export const countdownStatus = {
    paused: 'paused',
    running: 'running',
    stoped: 'stoped'
}

const COUNT_IN_MILLES = 10
const SECONDS_IN_MILLIS = 100 * COUNT_IN_MILLES
const MINUTES_IN_MILLIS = 60 * SECONDS_IN_MILLIS
const HOURS_IN_MILLES = 60 * MINUTES_IN_MILLIS
const DAYS_IN_MILLES = 24 * HOURS_IN_MILLES

export const toFixed = (num) => {
    return `0${num}`.slice(-2)
}

export const UPDATE = 'update'

class Countdown extends EventEmitter{

    status = countdownStatus.paused 
    remainTime = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        count: 0
    }
    endTimes = 0      // 距离倒计时结束的毫秒数
    step = 200    
    timer = null      // 用于清理倒计时      

    constructor(endTimes, step = 200) {
        super()
        this.endTimes = endTimes
        this.step = step
        this.start()
    }

    start() {
        this.status = countdownStatus.running
        this.down()
        this.onTick()
    }
    
    down() {
        if(this.status !== countdownStatus.running) {
            return
        }
        const remainCount = Math.max(this.endTimes - Date.now(), 0)
        this.remainTime = this.parseRemainTime(remainCount)
        if(remainCount != 0) {
            this.timer = setTimeout(this.down.bind(this), this.step)
        }else {
            this.stop()
        }
        this.onTick()
    }

    stop() {
        this.status = countdownStatus.stoped
        this.onTick()
    }

    parseRemainTime(remainCount) {
        const days = Math.floor(remainCount / DAYS_IN_MILLES)
        remainCount = remainCount % DAYS_IN_MILLES

        const hours = Math.floor(remainCount / HOURS_IN_MILLES)
        remainCount = remainCount % HOURS_IN_MILLES

        const minutes = Math.floor(remainCount /  MINUTES_IN_MILLIS)
        remainCount =  remainCount % MINUTES_IN_MILLIS

        const seconds = Math.floor(remainCount / SECONDS_IN_MILLIS)
        remainCount = remainCount % SECONDS_IN_MILLIS

        const count = Math.floor(remainCount / COUNT_IN_MILLES)

        return {
            days,
            hours,
            minutes,
            seconds,
            count
        }
    }

    onTick() {
        this.emit(UPDATE)
    }

    destroy() {
        clearTimeout(this.timer)
    }
}


export default Countdown