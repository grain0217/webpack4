module.exports = '模块a'

class B {}

// 
function * gen(){
  yield 1
}

console.log(gen().next())