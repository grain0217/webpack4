let foo = 100;
// setTimeout(() => {
//   foo = 2
// }, 500)
// module.exports = {
//   foo: foo,
// }
setTimeout(() => {
  module.exports.foo = 2
}, 500)
module.exports.foo = foo
console.log(exports)
console.log(module)