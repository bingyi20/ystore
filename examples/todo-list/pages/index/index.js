// index.js

import todoListStore from '../../store/todo-list-store'

// 获取应用实例
const app = getApp()

Page({
  onLoad() {
    todoListStore.bind('todo', this)
  },
  onInput(e) {
    todoListStore.onInput(e.detail.value)
  },
  addItem() {
    todoListStore.addItem()
  }
})
