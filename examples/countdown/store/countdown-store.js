import Store from 'ystore'
import Countdown from '../model/countdown'
import { UPDATE, countdownStatus, toFixed } from '../model/countdown'


class CountdownStore extends Store {
    constructor() {
        super()
        this.data = {
            remainTime: {},
            status: countdownStatus.paused,
        }
    }

    init(endTimes) {
        this.countdown = new Countdown(endTimes, 200)
        // 这里采用了发布订阅的方式进行数据更新通知，可以基于业务需求封装自己的一套
        this.countdown.on(UPDATE, () => {
            // 基于业务需要做数据同步更新的操作
            this.remainTime = this.countdown.remainTime
            Object.keys(this.remainTime).forEach(key => {
                this.remainTime[key] = toFixed(this.remainTime[key])
            })
            this.status = this.countdown.status
            this.update()
        })
    }

    destroy() {
        this.countdown.destroy()
        this.countdown = null
    }
}


export default new CountdownStore()