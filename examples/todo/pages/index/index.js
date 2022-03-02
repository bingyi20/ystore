// index.js
import todoStore from "../../store/todo-store"


// 获取应用实例
const app = getApp()

Page({
  onLoad() {
    todoStore.bind('todo', this)
  },
  onUnload() {
    todoListStore.remove(this)
  },
  addTodo(text) {
    todoStore.addTodo(text)
  },
  removeTodo(id) {
    todoStore.removeTodo(id)
  },
  toggle(id) {
    todoStore.toggle(id)
  },
  search(text) {
    todoStore.search(text)
  }
})
