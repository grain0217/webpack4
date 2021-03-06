## 几个名词
- chunk
- bundle
- module

当Webpack进行打包时，它也维护了一个manifest文件。可以在项目中生成的vendor包中找到。manifest描述了Webpack应该加载的文件。可以提取它并开始快速地加载项目的文件，而不必等待加载 vendor 包。

如果webpack生成的哈希更改，manifest也会更改。结果就是，供应商包的内容发生变化，并变为无效。通过将manifest 提取为一个文件或将其内联写入项目的index.html，则可以消除该问题。

---
## output
```js
{
  /* 对于单入口，filename 是一个静态名称
    当通过多个入口、代码拆分或各种插件创建多个bundle时，可以通过`name|chunkId|hash|chunkHash`为每个bundle命名*/
  filename: [name].bundle.js,
  output: '', // 指定构建结果的输出目录，必须是一个绝对路径
  /* publicPath 为项目中的所有资源指定一个基础路径
  相当于为静态资源路径添加前缀的作用，在生产中可以配置CDN地址
  静态资源最终引用路径 = output.publicPath + 资源loader或插件等配置路径 */
  publicPath: '',  // <script src="publicPath + name.js">
}
```

---
## 样式处理
#### style-loader 和 css-loader
`css-loader` 负责解析CSS代码，主要是为了处理CSS中的依赖，例如 `@import` 和 `url()` 等引用外部文件的声明。

而 `style-loader` 将 `css-loader` 解析的结果以`<style>`标签的形式插入到html文件中使CSS代码生效。
```js
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'body', // head | body | function
              injectType: 'singletonStyleTag', // styleTag | singletonStyleTag | lazyStyleTag | linkTag
              attributes: {
                name: 'balabala'
              },
            }
          }
        ]
      }
    ]
  }
}
```

#### sass-loader
在上述支持CSS的基础上，通常在开发中会使用 `Less/Sass` 等**预处理器**，webpack可以通过添加相应的loader来支持，以Sass为例：
```js
{
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}
```

#### PostCss
Sass和Less都是CSS**预处理器**，用于增强CSS语法。而PostCSS可以对CSS进行**后处理**，所谓的**后处理**就是对**原生的CSS**进行一定的修改增强：
- autoprefixer 补充浏览器前缀
- css-nano 优化压缩
- css-next 使用未来的CSS语法如表格布局
```
{
  module: {
    rules: [
      {
        test: /\.css/,
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: loader => [
            require('autoprefixer')()
          ]
        }
      }
    ]
  }
}
```

#### MiniCssExtractPlugin
webpack 4之前推荐`ExtractTextWebpackPlugin`将样式提取到单独的css文件，在webpack 4中已经被`MiniCssExtractPlugin`替代：
```js
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
{
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '', // 默认是 output.publicPath
            }
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
}
```
一般在开发环境使用`style-loader`，生产中使用`MiniCssExtractPlugin`，两者不能同时出现在`loader`链中。

---
## JS处理
#### babel
`babel` 是一个让我们能够使用 `ES` 新特新的JavaScript编译工具，我们可以在webpack中配置它以便使用 `ES 6`、`ES 7 ` 标准来编写JavaScript代码。

关于 `@babel/preset-env`、`@babel/plugin-transform-runtime`区别：
```js
{
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime',
              ]
            }
          }
        ],
      }
    ]
  }
```
`babel` 的相关配置也可以在目录下使用`.babelrc` 文件来处理。

#### eslint做代码规范检查
```js
{
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              enforce: 'pre', //
            }
          }
        ]
      }
    ]
  }
}

// .eslintrc.json
{
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module"
  }
}
```

#### 全局变量引入问题

#### noParse
使 webpack **忽略**对部分**没有采用模块化**（即不依赖其他模块）的文件进行依赖的递归解析处理，例如`jQuery`、`lodash`等体积大而又没有其他包依赖的库：
```js
{
  module: {
    noParse: /jquery|lodash/,
  }
}
```

---
## 图片处理
#### js import
需要 file-loader/url-loader

#### css
background url css-loader 支持 

#### 内联
借助html-with-image-loader

---
## 插件
#### HtmlWebpackPlugin
如果使用 `hash` 命名文件，打包出来的文件名不是固定的，可以通过 `HtmlWebpackPlugin` 将HTML中资源的引用路径和打包文件自动关联起来：
```js
// const HtmlWebpackPlugin = require('html-webpack-plugin')

{
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '测试title',
      // 对于多页应用，指定每个入口对应的需要的chunk
      // chunks: [],
      // 打包后的html文件名
      filename: 'index.html',
      // 对打包生成的HTML进行压缩
      minify: {
        // 删除双引号
        removeAttributeQuotes: true,
        // 折叠空格、换行等空白符
        collapseWhitespace: true,
      },
      // 是否为所有注入的静态资源添加webpack每次编译产生的唯一hash值
      // hash: true,
      // 指定assets插入的位置
      inject: 'body', // 'body' | true | false
    }),
  ]
}
```

#### cleanWebpackPlugin
用于在下一次打包时清除之前打包的文件：
```js
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
{
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```

#### copyWebpckPlugin
拷贝部分文件或指定整个目录到`build`路径下
```js
// const CopyWebpackPlugin = require('copy-webpack-plugin')
{
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'README.md'),
        to: path.resolve(__dirname, 'dist')
      }
    ]),
  ]
}
```

#### bannerPlugin
为每个 `chunk` 文件头部添加 版权声明
```js
{
  plugins: [
    new webpack.BannerPlugin('author: grain0217'),
  ]
}
```

#### webpack.IgnorePlugin
用于指定忽略某些特定模块，使webpack不把这些指定模块打包进去，如第三方库`moment`，打包的时候关于多国语言的配置文件`locale`会被引入，导致打包文件很大：
```js
{
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}
```

---
## resolve 模块解析
配置如何解析模块

#### alias
为指定模块创建别名：
```js
{
  resolve: {
    '@': path.resolve(__dirname, 'src')
  }
}
```
在其他模块中可以更简洁的引用src下的模块：
```js
import someModule from '@/utils/***'
```

#### modules
配置webpack去哪些目录下寻找第三方模块，默认是只会去 `node_modules` 目录下寻找。 

有的时候项目里会有一些模块会大量被其它模块依赖和导入，由于**其它模块的位置分布不定**，针对不同的文件都要去计算被导入模块文件的相对路径， 这个路径有时候会很长，比如一个`button`组件在某个组件中的导入方式可能如下：
``` 
import '../../../components/button'
```
这时可以利用 `resolve.modules` 配置项优化，假如那些被大量导入的模块都在 `./src/components` 目录下，可以设置modules:
```js
{
  resolve: {
    modules: ['./src/componets', 'node_modules']
  }
}
```
在需要使用它的组件或模块中，通过
```
import 'button'
```
即可导入`button`模块。

#### extensions
导入不带后缀的文件时，webpack会自动带上后缀访问文件是否存在，后缀列表默认值为:
```js
{
  resolve: {
    extensions: ['.js', '.json']
  }
}
```
如果这个列表越长，或者正确的后缀在越后面，就会造成尝试的次数越多，所以 `resolve.extensions` 的配置也会影响到构建的性能。 在配置时需要遵守以下几点，尽可能优化构建性能：

- 后缀尝试列表要尽可能小，不要把项目中不存在的情况写到后缀尝试列表中
- 频率出现最高的文件后缀优先放在前面，以做到尽快退出寻找过程
- 在源码中写导入语句时，要尽可能的带上后缀，从而避免寻找过程

---
## dev-server搭建本地开发环境
以上，完成了多种文件类型的 `webpack` 配置，可以使用 `webpack-dev-server ` 在本地开启一个简单的静态服务来进行开发。
```js
// package.json
// npm install webpack-dev-server
{
  "scripts": {
    "dev": "webpack-dev-server"
  }
}

```
一些常用配置：
```js
{
  devServer: {
    port: 3000, // 指定静态服务器的端口 默认是8080
    contentbase: path.join(__dirname, 'dist'), // 告诉静态资源服务器从哪个目录中提供内容
    // 如果设置了 HMR， publicPath 必须为完整的URL
    publicPath: '', // 由于webpack-dev-server打包的内容是放在内存中的，这些打包后的静态资源对外的暴露的根目录就是publicPath，在浏览器中访问静态资源时也应该带上publicPath路径
    // historyApiFallback 为true 时，任意的404响应都被替代为index.html
    historyApiFallback: {
      rewrites: [
        { from: /^home$/, to: '/' }
      ]
    }
  }
}
```

#### 模块热更新
```js
// webpack.config
{
  devServer: {
    hot: true,
  },
  plugins: [
    // 当开启 HMR 的时候使用该插件会打印更新模块的相对路径
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}

// 业务代码中，增加热更新处理
if (module.hot) {
  module.hot.accept()
}
```

#### 代理
```js
{
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000'
        pathRewrite: {
          '^/api': ''
        }
      }      
    }
  }
}
```
请求到 `/api/user` 会被代理到请求 `http://localhost:/user`

也可以借助 `before` 在 `webpack-dev-serve` 静态资源中间件处理之前, 拦截部分请求返回特定内容, 实现简单的数据 `mock`:
```js
{
  devServer: {
    proxy: {
      before (app) {
        app.get('/api/user', (res, req) => {
          res.json({name: 'grain0217', gender: 'male'})
        })
      }
    }
  }
}
```
另一种方式是通过 `wepack-dev-middleware`，使服务端和前端作为一个服务启动，也就不存在跨域问题了。

#### devtool(todo)
webpack官方文档中介绍了几种取值，用于控制如何生成`source map`, 不同的值会影响到构建和重新构建的速度。有些值适用于开发环境，这些

[具体区别](https://segmentfault.com/a/1190000008315937)

[官方文档](https://webpack.js.org/configuration/devtool/)
- eval
- source-map
- eval-source-map

  不产生map，但是显示行列
- cheap-source-map

- cheap-module-source-map

  不产生列，产生map
- cheap-module-eval-source-map

  不产生列,不产生map，集成在打包后的文件中

---
## webpack打包优化(doing)
#### tree-shaking(todo)

#### 懒加载
```js
{
  import(某个模块).then(() => {})
}
```

#### 代码分割(实用)
webpack 4引入了`SplitChunksPlugin`来取代`CommonsChunkPlugin`，用来将业务代码与第三方公共依赖分离开，实现减少代码冗余，以及基于浏览器缓提高前端性能。

production 模式下默认开启，默认配置如下：
```js
{
  optimization: {
    splitChunks: {
      chunks: "async",  // 表示从哪些chunks里面抽取代码，'initial' | 'async' | 'all',
      minSize: 30000, // 被公用的代码压缩之前的体积小于30KB的话，它就不会被抽离成一个单独的文件
      minChunks: 1, // 表示被引用次数
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',node_modules/
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,   // 模块被不同的缓存组策略命中，优先级高策略生效。默认缓存组优先级为负数，默认自定义缓存组优先级为0
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```
 对于普通的应用，Webpack 4 内置的规则就足够了。
```js
{
  optimization: {
    splitChunks: {
      chunks: 'all',
      // initial 模式下会把异步和非异步模块分开打包。而 all 会把异步和非异步同时进行打包。也就是说moduleA在indexA中异步引入，indexB中同步引入， initial 下moduleA会出现在两个打包块中，而 all 只会出现一个。
      cacheGroups: {  // 缓存组
        common: {   // 自定义公共模块
          name: 'commons',
          chunks: 'initial', 
          minSize: 0,
          minChunks: 2,
        },
        // 这里要注意externals配置的第三方模块不会被打包
        vendor: {   // 把所有 node_modules 中引入的模块打包成一个文件
          name: 'vendor',
          priority: 10,
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          minSize: 0,
          minChunks: 2,
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks:['vendor', 'common'], // 引入chunks时，加入对应的模块
      filename: 'index.html',
    })
  ]
}
```

#### dllPlugin(实用)
使用`SplitChunksPlugin`会有一个问题 —— 每次构建的时候都会重新打包，而一般来说第三方库的代码除了版本更新很少变动，这无疑增加了打包时间，因此需要使用`DLLPlugin`(Dynamic Link Library)把复用性较高的第三方模块打包到动态链接库中。

使用`dll`时，可以把构建过程分成`dll`构建过程和主构建过程，`DLLPlugin`需要配合`DLLReferencePlugin`使用。
`dll`构建过程：
```js
// webpack.dll.config.js
{
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, 'dist/dll'),
    library: '[name]_dll_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_dll_[hash]',
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      path: path.join(__dirname, 'dist', '[name].manifest.json')
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
    })
  ]
}
```
在主构建配置文件中使用动态库文件，通过`DllReferencePlugin`引用`dll`的`manifest`文件来把依赖的名称映射到模块的`id`上，之后在需要的时候通过内置的`webpack_require`来引入：
```js
{
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dist/dll/react.manifest.json')
    })
  ]
}
```
`DllReferencePlugin`去`manifest.json`文件中读取name字段的值，把值的内容作为在从全局变量中获取动态链接库内容时全局变量名，因此在`webpack.dll.config.js`文件中`DllPlugin`的参数`name`必须和`output.library`保持一致。
最后，省工程的`dll`暴露出的是全局函数，要在入口文件中引入对应的`dll`文件：
```html
<script src="dll/react.dll.js">
```
#### htmlInlineChunkPlugin
提前载入webpack加载代码

#### happypack
由于运行在 `Node.js` 之上的 webpack 是单线程的，想要让webpack同一时间处理多个任务，发挥多核CPU的威力，需要借助`happypack`，它把任务分解给多个子进程去并发执行，子进程处理完后再把结果发送给主进程。
```js
// const Happypack = require('happypack')
{
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js'
      }
    ]
  },
  plugins: [
    new Happypack({
      id: 'js',
      use: [
        // module js匹配的use配置
      ]
    })
  ]
}
```
默认开启3个进程；其他模块(样式、文件)的配置同理。
