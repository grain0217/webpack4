const button = document.createElement('button')
button.innerHTML = '阿牛'

button.addEventListener('click', () => {
  // console.log('click~~~~')
  // es 6 草案中的语法 jsonp实现动态加载文件
  import('./source').then(m => {
    console.log(m)
  })
})

document.body.appendChild(button)

if (module.hot) {
  module.hot.accept()
}