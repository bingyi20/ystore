
import todoStore from '../../store/todo-store'

Component({
    properties: {
        todos: {
            type: Array,
            value: []
        }
    },
    methods: {
        toggle(e) {
            todoStore.toggle(e.currentTarget.dataset.id)
        },
        delete(e) {
            let { id, value } = e.currentTarget.dataset
            wx.showActionSheet({
                alertText: `将永久删除“${value}”`,
                itemColor: '#D81F06',
                itemList: ["删除任务"],
                success (res) {
                    todoStore.delete(id)
                }
            })
        }
    }
})