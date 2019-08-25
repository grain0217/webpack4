### 几个名词
- chunk
- bundle
- module

当Webpack进行打包时，它也维护了一个manifest文件。可以在项目中生成的vendor包中找到。manifest描述了Webpack应该加载的文件。可以提取它并开始快速地加载项目的文件，而不必等待加载 vendor 包。

如果webpack生成的哈希更改，manifest也会更改。结果就是，供应商包的内容发生变化，并变为无效。通过将manifest 提取为一个文件或将其内联写入项目的index.html，则可以消除该问题。
### output

1. path
一个对应打包输出的绝对路径
2. filename
- 对于单入口，filename 是一个静态名称
- 当通过多个入口、代码拆分或各种插件创建多个bundle时，可以通过name/chunkId/hash/chunkHash为每个bundle命名
```
{
  output: {
    filename: [name].bundle.js
  }
}
```
3. publicPath
指定项目打包生成的**引用**css，js，img等资源时的基础路径，相当于为静态资源路径添加前缀的作用
一般在开发时使用 dist，在生产中可以配置CDN地址

### html插件
HtmlWebpackPlugin，简化创建服务于webpack bundle的HTML文件，自动生成一个 html 文件，并且引用相关的 assets 文件(如 css, js)。
### 样式处理
##### style-loader
将css-loader打包好的css代码以`<style>`标签的形式插入到html文件中
##### css-loader
使你能够使用类似@import和url（…）的方法实现require CSS代码块的功能
##### sass-loader
处理sass文件
##### PostCss
Sass和Less都是CSS预处理器，只能对CSS进行`预处理`，而PostCSS可以对CSS进行`后处理`，所谓的后处理就是对原生的CSS进行一定的修改增强
- Autoprefixer 补充浏览器前缀
- CSS-nano 优化压缩
- CSS-next 使用未来的CSS语法

##### extractTextWebpackPlugin
将样式提取到单独的css文件
### 转化es6语法
### 处理js语法以及eslint
### 全局变量引入问题

### 图片处理

##### js import
需要 file-loader/url-loader
##### css
background url css-loader 支持 
##### 内联
借助html-with-image-loader
 
### 代码分割和懒加载
  - commonsChunkPlugin 多entry公共代码抽取

### 配合优化
htmlInlineChunkPlugin 提前载入webpack加载代码

### devserver搭建本地开发环境
##### contentbase
指定html页面所在的目录，默认指向项目的根目录
##### publicPath


- live reloading
- 路径重定向
- historyApiFallback
- https
- 在浏览器中显示编译错误

##### proxy
 ```
proxy: {
  '/api': {
    changeOrigin: true,
    target: ''
    // pathRewrite: {}
  }      
}
 ```

- 模块热更新
  - hot: true
  - webpack.HotModuleReplacementPlugin
- souceMap 帮助调试

3. express + webpack-dev-middleware