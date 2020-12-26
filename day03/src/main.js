// 导入React包
import React from 'react'
import ReactDOM from 'react-dom'
// 导入我们自己定义的组件(使用普通方式,未使用Context方式传递)
import UnUseContext from './components/Context/Context_unused.jsx'
// 导入我们自己定义的组件(使用Context方式传递)
import UseContext from './components/Context/Context_used.jsx'

// 页面元素的渲染
ReactDOM.render(
  <div>
    <UnUseContext></UnUseContext>
    <hr/>
    <UseContext></UseContext>
  </div>,
  document.getElementById('app')
)
