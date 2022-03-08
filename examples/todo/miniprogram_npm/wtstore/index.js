module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1646294938278, function(require, module, exports) {
const { queueStore } =  require("./schedules")

const OBJECT_TYPE = '[object Object]'
const ARRAY_TYPE = '[object Array]'
const FUNCTION_TYPE = '[object Function]'

let uid = 0

let noop = function(){}

const clone = require('rfdc')()

class Store {

    constructor() {
        this.id = ++uid
        this._data = {}
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
        view._preData = (view._preData ? view._preData : {})
        this.render(view, key)
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
        let promises = []
        this._views.forEach(item => {
            promises.push(this.render(item.view, item.key))
        })
        // 所有UI数据更新完成之后执行回调
        Promise.allSettled(promises).then(this._callback)
    }

    render(view, path) {
        return new Promise((resolve) => {
            const patch = this.diffData(view.data[path], view._preData[path], path)
            view.setData(patch, resolve)
            // 深克隆可以进行优化，diff的时候就能进行数据的变更修改
            view._preData[path] = clone(view.data[path])
        })
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

}, function(modId) {var map = {"./schedules":1646294938279}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1646294938279, function(require, module, exports) {

let queue = []

let has = {}

let pending = false

const p = Promise.resolve()

function flushSchedulerQueue() {
    for(let i = 0; i< queue.length; i++) {
        queue[i].run()
    }
    has = {}
    queue = []
    pending = false
}

exports.queueStore = function(store) {
    let id = store.id
    if(has[id]) {
        return
    }
    has[id] = true
    queue.push(store)
    if(!pending) {
        pending = true
        p.then(flushSchedulerQueue)
    }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1646294938278);
})()
//miniprogram-npm-outsideDeps=["rfdc"]
//# sourceMappingURL=index.js.map