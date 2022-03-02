import Wtstore from 'westore'
import TodoModel from '../model/todo-model'

class TodeStore extends Wtstore {
    constructor() {
        super()
        this.data = {
            todos: [],
            searchTodos: []
        }
        this.todoModel = new TodoModel()
        this.todoModel.subscribe(() => {
            this.data.todos = this.todoModel.data
            this.searchTodos = this.todoModel.searchTodos
        })
    }

    addTodo(text) {
        this.todoModel.addTodo(text)
    }

    removeTodo(id) {
        this.todoModel.removeTodo(id)
    }

    toggle(id) {
        this.todoModel.toggle(id)
    }

    search(text) {
        this.todoModel.search(text)
    }
}

export default new TodeStore()