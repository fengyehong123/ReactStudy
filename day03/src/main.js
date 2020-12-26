// 导入React包
import React from 'react'
import ReactDOM from 'react-dom'

// 导入我们自定义的根组件
import App from './App.jsx'
/*
  全局导入Ant Design样式表(如果我们在webpack.config.js文件中为.css文件开启了模块化之后,第三方的组件的.css文件就会失效)
  1. 一般我们使用的第三方UI组件的样式表文件都是以.css结尾的.所以我们最好不要为.css后缀名的文件启用模块化
  2. 我们推荐自己不要直接手写.css文件,而是自己手写.scss或者.less文件.这样我们只需要为.scss或者.less文件启用模块化就可以了
*/ 
import 'antd/dist/antd.css'

// 页面元素的渲染
ReactDOM.render(
  <App></App>,
  document.getElementById('app')
)
