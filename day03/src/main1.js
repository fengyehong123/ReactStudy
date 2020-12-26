// 导入React包
import React from 'react'
import ReactDOM from 'react-dom'
// 导入我们自己定义的组件
import Counter from './components/Counter.jsx'

// 页面元素的渲染
ReactDOM.render(
  // 每个用户在使用组件的时候,必须传递一个默认的数量值,作为组件初始化的数据
  <div>
    <Counter initCount={0}></Counter>
  </div>,
  document.getElementById('app')
)
