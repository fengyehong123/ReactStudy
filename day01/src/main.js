// 导入React包
import React from 'react'
import ReactDOM from 'react-dom'

// 导入评论列表的样式⭕这种样式是全局的
import './css/commentList.css'

// 导入评论列表组件
import CommentList from './components/comment1/CommentList.jsx'

// 页面元素的渲染
ReactDOM.render(
  <CommentList></CommentList>,
  document.getElementById('app')
)
