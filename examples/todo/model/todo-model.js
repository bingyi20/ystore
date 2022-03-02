
let ID = 0

let p = Promise.resolve(1)

export default class TodoModel {
    constructor() {
        this.flushing = false
        this.todos = []
        this.onChanges = []
        this.searchText = ''
        this.searchTodos = []
    }

    subscribe(fn) {
        this.onChanges.push(fn)
    }

    inform() {
        if(this.flushing)   return
        this.flushing = true
        p.then(() => {
            this.onChanges.forEach(cb => cb())
        })
    }

    addTodo(value) {
        let id = ID++
        let done = false
        this.todos.push({id, value, done})
        this.inform()
    }

    removeTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id)
        this.inform()
    }

    toggle(id) {
        for(let i = 0; i < this.todos.length; i++) {
            if(this.todos[i].id === id) {
                this.todos[i].done = !this.todos[i].done
                break
            }
        }
    }

    search(text) {
        this.searchTodos = this.todos.filter(todo => {
            return todo.value.include(text)
        })
    }


    
}