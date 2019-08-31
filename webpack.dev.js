const { smart } = require('./webpack-merge')
const base = require('./webpack.base.js')

module.exports = smart(base, {
  mode: 'development',
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
})
