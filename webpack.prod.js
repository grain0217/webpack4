const { smart } = require('./webpack-merge')
const base = require('./webapck.base.js')

module.exports = smart(base, {
  mode: 'production',
  optimization: {
    // minimizer: [
    //   new UglifyJsPlugin({
    //     // parallel: true,
    //     // sourceMap: true,
    //   }),
    //   new OptimizeCssAssetsPlugin()
    // ]
  },
})