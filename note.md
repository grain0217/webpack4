
## entry
入口
## output
出口
## loader
因为webpack本身只能处理JavaScript，如果需要处理其他类型的问题件，需要使用loader进行转换。

## plugin
使用plugin自定义API以及生命周期时间，可以控制webpack打包流程的每个环节，实现对webpack自定义功能拓展。

### 几个名词
- chunk
- bundle
- module

当Webpack进行打包时，它也维护了一个manifest文件。可以在项目中生成的vendor包中找到。manifest描述了Webpack应该加载的文件。可以提取它并开始快速地加载项目的文件，而不必等待加载 vendor 包。

如果webpack生成的哈希更改，manifest也会更改。结果就是，供应商包的内容发生变化，并变为无效。通过将manifest 提取为一个文件或将其内联写入项目的index.html，则可以消除该问题。


# 由浅入深
##### 打包JS
##### 编译ES6
##### 公共代码
##### 代码分割和懒加载
  - commonsChunkPlugin 多entry公共代码抽取
  
##### 处理CSS
  - style-loader将css-loader打包好的css代码以`<style>`标签的形式插入到html文件中
    - useable 手动加载css

  - css-loader使你能够使用类似@import和url（…）的方法实现require CSS代码块的功能
  - extractTextWebpackPlugin 提取到css文件
##### PostCSS
SASS和LESS都是CSS预处理器，只能对CSS进行`预处理`，而PostCSS可以对CSS进行`后处理`，所谓的后处理就是对原生的CSS进行一定的修改增强:
  - Autoprefixer 补充浏览器前缀
  - CSS-nano 优化压缩
  - CSS-next 使用未来的CSS语法
  
##### tree-shaking
##### 文件处理-（图片、字体文件、第三方JS库）
 - 第三方库
   - resolve, ProvidePlugin, import-loader
   
##### HtmlWebpackPlugin
这个插件用来简化创建服务于webpack bundle的HTML文件，它会自动帮你生成一个 html 文件，并且引用相关的 assets 文件(如 css, js)。

##### MiniCssExtractPlugin
提取CSS到单独的文件

##### 配合优化
- htmlInlineChunkPlugin 提前载入webpack加载代码

### 搭建本地开发环境
1. webpack watch mode

命令: webpack -watch

CleanWebpackPlugin 打包之前清除之前的文件

2. webpack-dev-server

- live reloading
- 路径重定向
- historyApiFallback
- https
- 在浏览器中显示编译错误
- 接口代理
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