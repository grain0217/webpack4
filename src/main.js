var foo = require('./CommonJsModule')
// console.log(foo);
// foo()
// console.log(foo.f())
console.log(foo.foo)
setTimeout(() => {
  // console.log(foo);
  // foo.f()
  console.log(foo.foo)
  console.log(require('./CommonJsModule').foo)
  // const f = require('./CommonJsModule')
  // console.log(require('./CommonJsModule').f())
}, 1000);

// import es6 from './ESModule'
// import es from './ESModule'
// console.log(es6)
// setTimeout(() => {
//   import es7 from './ESModule'
//   console.log(es7)
// }, 1000)