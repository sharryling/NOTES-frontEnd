const {merge} = require('webpack-merge')
const productionConfig = require('./webpack.prod.conf.js') // 引入生产环境配置文件
const webpack = require('webpack')
const path = require('path')

const baseConfig = {
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      h: ['dom-chef', 'h'],
    }),
  ],
}

module.exports = env => {
  // mode: 'production' || 'development',
  let config = productionConfig
  console.log('当前模式:', env, config)
  return merge(baseConfig, config) // 合并 公共配置 和 环境配置
}
