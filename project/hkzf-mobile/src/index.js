import React from 'react';
import ReactDOM from 'react-dom';
// 导入App根组件
import App from './App';

// 导入antd-mobile的样式(在入口文件处全局导入一次)
import 'antd-mobile/dist/antd-mobile.css'
// 导入我们自定义的全局组件样式,因为是后导入的,所以可以覆盖组件库的样式
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);