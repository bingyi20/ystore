import Wtstore from 'wtstore'
import TodoModel from '../model/todo-model'
import { SEARCH_STATE } from '../model/todo-model'

class TodoStore extends Wtstore {
    constructor() {
        super()
        this.data = {
            todos: [],
            doneTodos: [],
            undoneTOdos: [],
            searchTodos: []
        }
        this.todoModel = new TodoModel()

        this.todoModel.subscribe(() => {
            this.data.todos = this.todoModel.todos
            this.data.doneTodos = this.todoModel.doneTodos
            this.data.undoneTodos = this.todoModel.undoneTodos
            this.data.searchText = this.todoModel.searchText
            this.data.searchTodos = this.todoModel.searchTodos
            this.update()
        })
    }

    add(text) {
        this.todoModel.add(text)
    }

    delete(id) {
        this.todoModel.delete(id)
    }

    toggle(id) {
        this.todoModel.toggle(id)
    }

    search(text) {
        this.todoModel.search(text)
    }

    onbindinput(value) {
        this.todoModel.onbindinput(value)
    }

    clearHistory() {
        this.todoModel.clearHistory()
    }
}

export default new TodoStore()