import { cheers } from '../utils/util'

let ID = 0

let p = Promise.resolve(1)

export const SEARCH_STATE = {
    WORD: 'word',
    LIST: 'list'
}

export default class TodoModel {
    constructor() {
        this.flushing = false
        this.todos = [{
            id: ID++,
            value: '跑5分钟的步',
            done: false
        },{
            id: ID++,
            value: '学5分钟webpack',
            done: false
        },{
            id: ID++,
            value: '给婷子姐姐买早餐',
            done: true
        },{
            id: ID++,
            value: '学5分钟浏览器工作原理',
            done: false
        },{
            id: ID++,
            value: '10分钟完成今天开发需求',
            done: false
        },{
            id: ID++,
            value: '打2小时游戏',
            done: true
        },{
            id: ID++,
            value: '刷5分钟算法',
            done: false
        },{
            id: ID++,
            value: '看一部电影',
            done: false
        },{
            id: ID++,
            value: '学5分钟设计模式',
            done: false
        },{
            id: ID++,
            value: '给婷子姐姐买咖啡',
            done: true
        },{
            id: ID++,
            value: '学5分钟设计模式',
            done: false
        },{
            id: ID++,
            value: '学5分钟设计模式',
            done: false
        },{
            id: ID++,
            value: '学5分钟设计模式',
            done: false
        },{
            id: ID++,
            value: '学5分钟设计模式',
            done: false
        },{
            id: ID++,
            value: '看一部电影',
            done: false
        }]


        this.onChanges = []
        this._searchState = SEARCH_STATE.WORD
        this.searchText = ''
        this.searchHistory = []

    }

    subscribe(fn) {
        // 去个重吧
        if(this.onChanges.indexOf(fn) > -1) return
        this.onChanges.push(fn)
        fn()
    }

    inform() {
        if(this.flushing)   return
        this.flushing = true
        p.then(() => {
            this.onChanges.forEach(cb => cb())
            this.flushing = false
        })
    }

    add(value) {
        let id = ID++
        let done = false
        this.todos.push({id, value, done})
        this.inform()
    }

    delete(id) {
        this.todos = this.todos.filter(todo => todo.id !== id)
        this.inform()
    }

    toggle(id) {
        for(let i = 0; i < this.todos.length; i++) {
            if(this.todos[i].id === id) {
                this.todos[i].done = !this.todos[i].done
                if(this.todos[i].done) {
                    cheers()
                }
                break
            }
        }
        this.inform()
    }

    onbindinput(value) {
        value = value.trim()
        console.log(value)
        this.searchText = value
        if(value === '') {
            this.searchState = SEARCH_STATE.WORD
        }
        this.inform()
    }

    search(text) {
        text = text.trim()
        this.searchText = text
        if(text === '') {
            return this.inform()
        }

        // 做一次LRU处理
        let idx = this.searchHistory.indexOf(text)
        if(idx > -1) this.searchHistory.splice(idx, 1)
 
        this.searchHistory.unshift(text)
        this.searchState = SEARCH_STATE.LIST
        this.inform()
    }

    clearHistory() {
        this.searchHistory = []
        this.inform()
    }

    get doneTodos() {
        return this.todos.filter((todo) => todo.done)
    }

    get undoneTodos() {
        return this.todos.filter((todo) => !todo.done)
    }

    get searchTodos() {
        return this.todos.filter((todo) => todo.value.includes(this.searchText))
    }

    set searchState(val) {
        this._searchState = val
        this.inform() 
    }

    get searchState() {
        return this._searchState
    }
}