require('@babel/polyfill')
import logo from './assets/icon.png'
const image = new Image()
console.log(logo)
image.src = logo
document.body.appendChild(image)
export const moduleB = {
  name: 'guyu',
  fun: () => {
    console.log()
  },
  gen: function * (){
    yield 1
  }
}