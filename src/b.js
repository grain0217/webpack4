require('@babel/polyfill')
export const moduleB = {
  name: 'guyu',
  fun: () => {
    console.log()
  },
  gen: function * (){
    yield 1
  }
}