# README

## 关键词说明
**view**: Page/Component实例

**store**: 继承自类Store的实例

**model**: 核心业务逻辑实例

---
## 安装
`` npm i wtstore --save
npm 相关问题参考：[小程序官方文档-npm支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

---
## 整体架构
- **Object-Oriented Programming**: Wtstore 强制小程序使用面向对象程序设计，开发者起手不是直接写页面，而是使用职责驱动设计 (Responsibility-Driven Design)的方式抽象出类、类属性和方法以及类之间的关联关系。
- **Write Once, Use Anywhere(Model)**: 通过面向对象分析设计出的 Model 可以表达整个业务模型，开发者可移植 100% 的 Model 代码不带任何改动到其他环境，并使用其他渲染技术承载项目的 View，比如小程序WebView、小游戏、Web浏览器、Canvas、WebGL。
- **Passive View**: Wtstore架构下的 View 非常薄，没有参杂任何业务逻辑，只做被动改变。
- **Simple and Intuitive**: Westore 内部使用 deepClone + dataDiff 换取最短路径， 比setData 更符合直觉的编程体验，只需修改数据，然后update，不需要再使用 setData(xxxxxxxxxxx)。
- **Testability**: View 和 Model 之间没有直接依赖，开发者能够借助模拟对象注入测试两者中的任一方。
- **No invasion**: 在使用Wtstore的情况下，你依旧可以使用小程序原有的所有语法，Wtstore不会带来任何的副作用。

Westore 架构和 MVP(Model-View-Presenter) 架构很相似:
- View 和 Store 是双向通讯，View 和 Store 互相引用
- View 与 Model 不发生联系，都通过 Store 传递
- Store 引用 Model 里对象的实例，Model 不依赖 Store
- View 非常薄，不部署任何业务逻辑，称为"被动视图"（Passive View），即没有任何主动性
- Store 非常薄，只复杂维护 View 需要的数据和桥接 View 和 Model
- Model 非常厚，但是都是纯JS逻辑代码，你可以基于业务中的不同指责对你的Model类进行精心设计   所有逻辑都部署在那里，Model 可以脱离 Store 和 View 完整表达所有业务/游戏逻辑

Store 层可以理解成**中介者模式**中的中介者，使 View 和 Model 之间的多对多关系数量减少为 0，负责中转控制视图对象 View 和模型对象 Model 之间的交互。

随着小程序承载的项目越来越复杂，合理的架构可以提升小程序的扩展性和维护性。把逻辑写到 Page/Component 是一种罪恶，当业务逻辑变得复杂的时候 Page/Component 会变得越来越臃肿难以维护，每次需求变更如履薄冰， westore 定义了一套合理的小程序架构适用于任何复杂度的小程序，让项目底座更健壮，易维护可扩展。

---

## Packages
- src           wtstore 的核心代码
- examples   wtstore 官方例子

---
## 倒计时案例
> 应用截图

![wtstore倒计时案例](/assets/countdown.jpeg)


**以下只给出了核心代码部分，完整代码请移步 /examples/countdown目录**


1. 定义Model

```js
class Countdown extends EventEmitter {
    constructor(endTimes, step = 200) {
        super()
        this.endTimes = endTimes
        this.step = step
        this.start()
    }

    start() {
        this.status = countdownStatus.running
        this.down()
        this.onTick()
    }
    
    down() {
        if(this.status !== countdownStatus.running) {
            return
        }
        const remainCount = Math.max(this.endTimes - Date.now(), 0)
        this.remainTime = this.parseRemainTime(remainCount)
        if(remainCount != 0) {
            this.timer = setTimeout(this.down.bind(this), this.step)
        }else {
            this.stop()
        }
        this.onTick()
    }

     onTick() {
        this.emit(UPDATE)
    }
}
```

model中封装了核心业务逻辑，当倒计时数据发生变化的时候，会通过发布事件`UPDATE`通知到相关订阅者

2. 定义Store
```js
class CountdownStore extends Wtstore {
    constructor() {
        super()
        this.data = {
            remainTime: {},
            status: countdownStatus.paused,
        }
    }
    init(endTimes) {
        this.countdown = new Countdown(endTimes, 200)
        // 这里采用了发布订阅的方式进行数据更新通知，可以基于业务需求封装自己的一套
        this.countdown.on(UPDATE, () => {
            // 基于业务需要做数据同步更新的操作
            this.remainTime = this.countdown.remainTime
            Object.keys(this.remainTime).forEach(key => {
                this.remainTime[key] = toFixed(this.remainTime[key])
            })
            this.status = this.countdown.status
            this.update()
        })
    }

    destroy() {
        this.countdown.destroy()
        this.countdown = null
    }
}
```
store中会订阅Countdown数据更新事件，然后更新自己应该更新的数据，然后调用父类Wtstore提供的update方法进行UI的更新

3. 视图层

js
```js
import countdownStore from "../../store/countdown-store"

Page({
  data: {},
  onLoad() {
    // 将page与store进行绑定，将store挂在到当前视图countdown路径上，wxml中就可以通过你countdown.xxx的方式直接使用store data定义的数据，当对应数据发生变更的时候会自动更新视图
    countdownStore.bind('countdown', this)
    // 启动倒计时
    countdownStore.init(Date.now() + 28 * 3600 * 1000)
  },
  unOnload() {
    countdownStore.remove(this)     // 进行视图内存回收
    countdownStore.destroy()        // 自定义销毁
  }
})
```

wxml
```html
<view class="container">
  <view class="count-down">
    <text class="number">{{countdown.remainTime.days}}</text> 天 
    <text class="number">{{countdown.remainTime.hours}}</text> 时 
    <text class="number">{{countdown.remainTime.minutes}}</text> 分 
    <text class="number">{{countdown.remainTime.seconds}}</text> 秒 
    : <text class="number">{{countdown.remainTime.count}}</text>
  </view>
</view>
```


## TodoApp 案例
1. 应用截图


2. 设计类图


3. 其它


## 贡献


## 声明
Wtstore借鉴自westore，在其MVP架构思想的基础之上做了大量改进与优化，diff算法也进行了重写，其中包括不限于
- 支持单**view**绑定多个**store**进行使用
- 支持单个**store**绑定多个**view**进行使用
- 统一内存回收策略
- 能监控到UI更新完成执行后续回调

