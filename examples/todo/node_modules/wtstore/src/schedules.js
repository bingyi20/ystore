
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