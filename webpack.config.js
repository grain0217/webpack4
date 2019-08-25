const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: './src/index.js',
  output: {
    // 打包后的文件名
    filename: 'bundle.[hash].js',
    path: path.resolve(__dirname, 'dist'), // 必须是一个绝对路径
  },
  devServer: {
    port: 3000,
    progress: true,
    contentBase: './dist',
    overlay: true,
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules',
        use: {
          loader: 'eslint-loader',
          options: {
            enforce: 'pre', //
          }
        },
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        ]
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
    // 只在production模式下有效
    minimizer: [
      new UglifyJsPlugin({
        // parallel: true,
        // sourceMap: true,
      }),
      new OptimizeCssAssetsPlugin()
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '测试title',
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
      filename: 'main.css'
    })
  ]
}
