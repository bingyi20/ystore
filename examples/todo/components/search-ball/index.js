
import todoStore from '../../store/todo-store'

const LONG_TIME_DURATION = 300

let timer = null
let isMove = false

let offset={
    x: 0,
    y: 0
}

Component({
    data: {
        moving: false,
        position: {
            left: 300,
            top: 100
        }
    },
    lifetimes: {
        attached() {
            todoStore.bind('todo', this)
        },
        detached() {
            todoStore.remove(this)
        }
    },
    methods: {
        toggleSearch() {
            if(isMove) return
            if(todoStore.searchState) {
                todoStore.search('')
            }
            todoStore.toggleSearch()
        },
        ontouchstart(e) {
            isMove = false
            timer = setTimeout(() => {
                isMove = true
                this.setData({
                    moving: true
                })
                let {clientX, clientY} = e.touches[0]
                offset.x = (clientX - this.data.position.left)
                offset.y = (clientY - this.data.position.top)
                wx.vibrateShort({
                    type: 'heavy'
                })
            }, LONG_TIME_DURATION)
        },
        ontouchmove(e) {
            clearTimeout(timer)
            if(!this.data.moving) return
            let {clientX, clientY} = e.touches[0]
            this.setData({
                position: {
                    left: clientX - offset.x,
                    top: clientY - offset.y
                }
            })

        },
        ontouchend() {
            clearTimeout(timer)
            if(this.data.moving) {
                this.setData({
                    moving: false
                })
            }
        }
    }
})