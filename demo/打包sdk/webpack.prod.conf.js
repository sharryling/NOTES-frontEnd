const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    libraryTarget: 'umd',
    path: __dirname + '/dist',
    filename: '[name].[chunkhash].js',
    library: 'myFunc',
    publicPath: './'
  },
  performance: {
    hints: false
  },
  plugins: [],
  optimization: {
    // 将业务模块和第三方库进行分割???
    splitChunks: {
      chunks: 'all'
    }
  },
}
