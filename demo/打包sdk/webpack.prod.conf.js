const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    libraryTarget: 'umd',
    path: __dirname + '/dist',
    filename: 'index.js',
    library: 'myFunc',
    publicPath: './'
  },
  performance: {
    hints: false
  },
  plugins: [],
  optimization: {
    // minimize: true,
  },
}
