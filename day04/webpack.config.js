const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, './src/main.js'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js'
  },
  plugins: [ // 插件
    new htmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      // css-loader?modules: 给css-loader添加modules参数,启用CSS的模块化
      // &localIdentName=[name]_[local]-[hash:5] 给我们定义的类名添加一个hash值,保证每一个类名不重名还有语义(默认生成的类名是一串没有语义的英文字母 )
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader?modules&localIdentName=[name]_[local]-[hash:5]', 'sass-loader'] },
      { test: /\.(png|gif|bmp|jpg)$/, use: 'url-loader?limit=5000' },
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}