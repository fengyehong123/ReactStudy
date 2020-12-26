// 导入React包
import React from 'react'
import ReactDOM from 'react-dom'
// 导入我们自己定义的组件
import CMTList from './components/Comment/CmtList.jsx'

// 页面元素的渲染
ReactDOM.render(
  <div>
    <CMTList></CMTList>
  </div>,
  document.getElementById('app')
)
