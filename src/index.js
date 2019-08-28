console.log('hello webpack4')
// const str = require('./a')
// console.log(str)
import axios from 'axios'
import { moduleB } from './b'
console.log(moduleB)

require('./index.css')
require('./index.sass')


/**
 * babel 将JavaScript分为 syntax 和 api
 * api 指那些可以通过函数重新覆盖的语法，如includes、map、Promise、Set、Proxy
 * syntax 如 let、const、class 无法在JavaScript运行时重写
 * 1. babel只负责转换syntax，api层面的被单独放在了polyfill模块处理
 * 
 * 2. babel 转译后的代码要实现源代码同样的功能需要借助一些帮助函数，
 * 这些帮助函数可能会重复出现在一些模块里，导致编译后的代码体积变大。
 * babel 为了解决这个问题，提供了单独的包 babel-runtime 供编译模块复用工具函数。
 */
// 箭头函数 es6语法， 需要 babel/preset-env 编译
const fn = () => {
  console.log('log es6 test')
}
fn()

// 私有变量 需要plugin-proposal-class-properties
class A {
  a = 'a in A'
}

let o = new A()
console.log(o.a)

console.log('aaa'.includes('a'))

axios.get('/api/user').then(res => {
  console.log(res)
})