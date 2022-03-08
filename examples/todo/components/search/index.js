import todoStore from '../../store/todo-store'

const app = getApp()

Component({
    data: {
        MBBCRect: {
            width: 87,
            height: 32,
            top: 51,
            right: 51
        }
    },
    attached() {
        todoStore.bind('todo', this)
        app.globalData.search = this
        const res = wx.getMenuButtonBoundingClientRect()
        console.log(res)
        this.setData({
            MBBCRect: res
        })
    },
    methods: {
        onBindinput(e) {
            let value = e.detail.value.trim()
            if(value === todoStore.value) return
            todoStore.search(value)
        }
    }
})