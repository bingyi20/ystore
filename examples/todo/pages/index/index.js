import todoStore from '../../store/todo-store'

let app = getApp()

const DUMMY_HEIGHT = 40

Page({
  data: {
    addInputState: false,
    isFocus: false,
    inputBottom: 0,
    isOpenDoneList: true,
    searchState: false,
  },
  onLoad() {
    todoStore.bind('todo', this)
  },
  unonLoad() {
    todoStore.remove(this)
  },
  showAddInput() {
    this.setData({
      addInputState: true,
      isFocus: true
    })
  },
  onBindkeyboardheightchange(e) {
    let height = e.detail.height
    console.log(height)
    this.setData({
      inputBottom: height - DUMMY_HEIGHT
    })
  },
  toggleView() {
    this.setData({
      isOpenDoneList: !this.data.isOpenDoneList
    })
  },
  onBindblur() {
    this.setData({
      isFocus: false,
      addInputState: false,
      inputBottom: -DUMMY_HEIGHT
    })
  },
  add(e) {
    let value = e.detail.value.trim()
    if(value === '') return
    todoStore.add(value)
  }
})