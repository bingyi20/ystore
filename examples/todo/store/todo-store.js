import Store from 'ystore'
import TodoModel from '../model/todo-model'
import { SEARCH_STATE } from '../model/todo-model'

class TodoStore extends Store {
    constructor() {
        super()
        this.data = {
            todos: [],
            doneTodos: [],
            undoneTodos: [],
            searchTodos: [],
            searchText: '',
            searchState: false
        }
        this.todoModel = new TodoModel()

        this.todoModel.subscribe(() => {
            this.todos = this.todoModel.todos   // ==> this.data.todos = this.todoModel.todos
            this.doneTodos = this.todoModel.doneTodos
            this.undoneTodos = this.todoModel.undoneTodos
            this.searchText = this.todoModel.searchText
            this.searchTodos = this.todoModel.searchTodos
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

    // 长尾业务逻辑不需要封装到model，可以直接在store中处理之后调用update更新即可
    toggleSearch() {
        this.searchState = !this.searchState
        this.update()
    }
    
}

export default new TodoStore()