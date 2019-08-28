const express = require('express')
const app = express()
// const webpack = require('webpack')
// const middleware = require('webpack-dev-middleware')
// const config = require('./../webpack.config')

// const compiler = webpack(config)
// app.use(middleware(compiler))
app.get('/api/user', (req, res) => {
  res.json({
    name: 'grain0217',
    gender: 'male'
  })
})
app.listen(8000)