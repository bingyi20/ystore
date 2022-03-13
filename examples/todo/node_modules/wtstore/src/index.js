const { queueStore } =  require("./schedules")

const OBJECT_TYPE = '[object Object]'
const ARRAY_TYPE = '[object Array]'
const FUNCTION_TYPE = '[object Function]'

let uid = 0

let noop = function(){}

const clone = require('rfdc')()

const p = Promise.resolve(1)

// 微任务调度器
const microTask = (fn) => {
    p.then(fn)
}

class Store {

    constructor() {
        this.id = ++uid
        this._data = {}
        this._preData = {}
        this._views = []
        this._hasViews = new Map()
        this._callback = noop
    }

    bind(key, view) {
        if(this._hasViews.has(view)) return Error("The same store and view cannot be bound repeatedly")
        this._views.push({
            key,
            view
        })
        view.data[key] = this.data
        this.render(view, key, this.data)
    }

    update(callback) {
        if(callback) {this._callback = callback}
        queueStore(this)
    }

    remove(view) {
        this._views = this._views.filter(item => {
            return item.view != view
        })
    }

    run() {
        const patch = this.diffData(this.data, this._preData, '')
        let promises = []
        this._views.forEach(item => {
            promises.push(this.render(item.view, item.key, patch))
        })
        // 所有UI数据更新完成之后执行回调
        Promise.allSettled(promises).then(this._callback)
        // 通过微任务做深拷贝，可以更早将渲染数据发送至渲染层
        microTask(() => {
            this._preData = clone(this.data)
        })
    }

    render(view, path, patch) {
        return new Promise((resolve) => {
            const relPatch = this.splicePatch(path, patch)
            view.setData(relPatch, resolve)
        })
    }

    splicePatch(path, patch) {
        let result = {}
        Object.keys(patch).forEach(key => {
            result[`${path}.${key}`] = patch[key]
        })
        return result
    }

    diffData(curr, pre, path = '') {
        if(!pre) pre = {}
        this.syncKeys(curr, pre)
        let result = {}
        this.diff(curr, pre, path, result)
        return result
    }

    syncKeys(curr, previous) {
        const currType = this.getType(curr)
        const previousType = this.getType(previous)
        if(currType === OBJECT_TYPE && previousType === OBJECT_TYPE) {
            for(let key in previous) {
                let previousValue = previous[key]
                if(curr[key] === undefined) {
                    curr[key] = null
                }
                let currValue = curr[key]
                this.syncKeys(currValue, previousValue)
            }
        }else if(currType === ARRAY_TYPE && previousType === ARRAY_TYPE) {
            previous.forEach((item, index) => {
                this.syncKeys(curr[index], item)
            });
        }
    }

    diff(curr, previous, path, result) {
        const currType = this.getType(curr)
        const previousType = this.getType(previous)
        if(curr === previous) {
            return
        }else if(currType === OBJECT_TYPE && previousType === OBJECT_TYPE) {
            for(let key in curr) {
                this.diff(curr[key], previous[key], this.setPath(path, key), result)
            }
        }else if(currType === ARRAY_TYPE && previousType === ARRAY_TYPE) {
            if(previous.length > curr.length) {
                this.setResult(result, path, curr)
            }else { 
                curr.forEach((item, index) => {
                    this.diff(item, previous[index], this.setPath(path, index), result)
                })
            }
        }else {
            // 收集结果
            this.setResult(result, path, curr)
        }
    }

    /**
     * 将this.data的数据挂载到this上
     */
    proxyData() {
        Object.keys(this.data).forEach(key => {
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return this.data[key]
                },
                set(value) {
                    this.data[key] = value
                }
            })
        })
    }

    getType(obj) {
        return Object.prototype.toString.call(obj)
    }

    setPath(path, key) {
        if(typeof key === 'number') {
            return `${path}[${key}]`
        }else {
            return path ? `${path}.${key}` : key
        }
    }

    setResult(result, k, v) {
        if(typeof v !== FUNCTION_TYPE) {
            result[k] = v
        }
    }

    get data() {
        return this._data
    }

    // 防止引用地址被非法篡改
    set data(obj) {
        if(!obj || this.getType(obj) !== OBJECT_TYPE) {
            throw new Error('The right value must be a valid object.')
        }
        Object.assign(this._data, obj)
        this.proxyData()
    }
}

module.exports = Store
