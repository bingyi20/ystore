import todoStore from '../../store/todo-store'

const app = getApp()

Component({
    data: {
        isFocus: true,
        opacity: 0.6,
        MBBCRect: {
            width: 87,
            height: 32,
            top: 51,
            right: 51
        }
    },
    lifetimes: {
        attached() {
            todoStore.bind('todo', this)
            app.globalData.search = this
            const res = wx.getMenuButtonBoundingClientRect()
            this.setData({
                MBBCRect: res
            })
        },
        detached() {
            this.setData({
                opacity: 0.6
            })
            todoStore.remove(this)
        }
    },
    methods: {
        onBindinput(e) {
            let value = e.detail.value.trim()
            if(value === todoStore.value) return
            todoStore.search(value)
        },
        clear() {
            todoStore.search('')
        }
    }
})