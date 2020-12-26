// 导入React包
import React from 'react'
import ReactDOM from 'react-dom'
// 导入我们自己定义的组件
import BindThis from './components/BindThis.jsx'

// 页面元素的渲染
ReactDOM.render(
  <div>
    <BindThis></BindThis>
  </div>,
  document.getElementById('app')
)
