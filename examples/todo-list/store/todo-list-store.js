import Store from "wtstore";

let msg_id = 0
class TodoListStore extends Store {
    constructor() {
        super()
        this.data = {
            value: '',
            list: []
        }
    }

    addItem() {
        let value = this.data.value.trim()
        if(!value) return
        this.data.list.unshift({
            id: ++msg_id,
            text: value
        })
        this.data.value = ''
        this.update()
    }

    removeItem(id) {
        this.data.list = this.data.list.filter(item => {
            return item.id != id
        })
        this.update()
    }

    onInput(value) {
        this.data.value = value
        this.update()
    } 
}


export default new TodoListStore()
