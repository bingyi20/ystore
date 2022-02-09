const Store = require("../src/index")

class PersonStore extends Store {
    constructor() {
        super()
        this.data = {
            name: 'bing',
            age: 18,
            hobby: ['Basketball', 'Swimming', 'coding', 'Fairy'],
            achievement: {
                chinese: 90,
                math: 100,
                english: 80 
            }
        }
    }
    birthday() {
        this.age++
    }
}

const bing  = new PersonStore()

test('are the basic data types equal', () => {
    expect(bing.data.name === bing.name).toBe(true)
})

test('are the object data types equal', () => {
    expect(bing.data.hobby === bing.hobby).toBe(true)
})

test('are the array data types equal', () => {
    expect(bing.data.hobby === bing.hobby).toBe(true)
})

test('are the deep data equal', () => {
    expect(bing.data.achievement.chinese === bing.achievement.chinese).toBe(true)
})

// 测试数据是否同步修改
bing.birthday()
test('Whether the data changes synchronously', () => {
    expect(bing.data.age === bing.age).toBe(true)
})