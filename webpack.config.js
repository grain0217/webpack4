const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happypack')

module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: {
    // main: './src/index.js',
    // main: './src/react.js'
    index: './src/public/index.js',
    other: './src/public/other.js'
  },
  output: {
    // 打包后的文件名
    // filename: 'bundle.[hash].js',
    filename: '[name].js',
    publicPath: '',
    path: path.resolve(__dirname, 'dist'), // 必须是一个绝对路径
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // externals: {
  //   // 如项目中有模块已经来源于外部依赖(cdn等)，不需要将这些import的包打包到bundle中
  //   jquery: '$'
  // },
  devtool: 'source-map',
  devServer: {
    port: 3000,
    progress: true,
    // publicPath: '',
    contentBase: './dist',
    overlay: true,
    compress: true,
    proxy: {
      '/api': 'http://localhost:8000',
      // '/api': {
      //   target: 'http://localhost:8000',
      //   pathRewrite: {
      //     '^/api': ''
      //   }
      // }
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        // use: 'file-loader'
        use: {
          loader: 'url-loader',
          options: {
            // 在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。
            // limit: 200*1024,
            limit: 1,
            // outputPath: '/img/',
            // 当只为部分资源指定CDN地址时
            // publicPath: ''
          },
        }
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules',
        use: 'Happypack/loader?id=js',
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
          },
          {
            loader: 'eslint-loader',
            options: {
              enforce: 'pre', //
            }
          }
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              // 指定插入位置
              insert: 'body', // head | body | function
              injectType: 'singletonStyleTag', // styleTag | singletonStyleTag | lazyStyleTag | linkTag
              attributes: {
                name: 'balabala'
              },
            },
          },
          'css-loader'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      }
    ]
  },
  optimization: {
    // 只在 mode: production 下有效
    // sourceMap与minimizer冲突，导致sourceMap无效
    splitChunks: {  // 分割的代码块
      chunks: 'all',
      cacheGroups: {  // 缓存组
        common: {   // 公共模块
          name: 'commons',
          chunks: 'initial',  // 表示从哪些chunks里面抽取代码
          minSize: 0, // 默认30000，如果没有修改minSize属性且被公用的代码size小于30KB的话，它就不会分割成一个单独的文件
          minChunks: 2, // 表示被引用次数，默认为1
        },
        vendor: {   // 第三方模块
          name: 'vendor',
          priority: 10,  // 默认缓存组优先级为负数，默认自定义缓存组优先级为0
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
        }
      }
    },
    // minimizer: [
    //   new UglifyJsPlugin({
    //     // parallel: true,
    //     // sourceMap: true,
    //   }),
    //   new OptimizeCssAssetsPlugin()
    // ]
  },
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
      // // 是否为所有注入的静态资源添加webpack每次编译产生的唯一hash值
      // hash: true,
      // 指定assets插入的位置
      inject: 'body', // 'body' | true | false
    }),
    new MiniCssExtractPlugin({
      // filename: '/css/main.css'
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // 自动加载模块，而不必到处 import 或 require
    // new webpack.ProvidePlugin({
    //   $: 'jquery'
    // }),
    new CleanWebpackPlugin(),
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, 'README.md'),
    //     to: path.resolve(__dirname, 'dist')
    //   }
    // ]),
    new webpack.BannerPlugin('author: grain0217'),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./dist/dll/react.manifest.json')
    // }),
    // new Happypack({
    //   id: 'js',
    //   use: [
    //     {
    //       loader: 'babel-loader',
    //       options: {
    //         presets: [
    //           '@babel/preset-env',
    //           '@babel/preset-react'
    //         ],
    //         plugins: [
    //           '@babel/plugin-proposal-class-properties',
    //           '@babel/plugin-transform-runtime',
    //         ]
    //       }
    //     },
    //     {
    //       loader: 'eslint-loader',
    //       options: {
    //         enforce: 'pre', //
    //       }
    //     }
    //   ]
    // })
  ]
}
