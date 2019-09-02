// let foo = () => {
//   console.log(111)
// };
let foo = 100
// setTimeout(() => {
//   foo = 200
// }, 500)
// module.exports = {
//   foo: foo,
// }
setTimeout(() => {
  module.exports.foo = 200
}, 500)
module.exports.foo = foo
// console.log(exports)
// console.log(module)
// module.exports = {
//   f: () => {
//     return foo
//   }
// }
// console.log(module)