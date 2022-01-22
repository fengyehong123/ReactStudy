import React from 'react';
import ReactDOM from 'react-dom';

// 导入antd-mobile的样式(在入口文件处全局导入一次)
import 'antd-mobile/dist/antd-mobile.css'
// 导入react-virtualized组件的样式
import 'react-virtualized/styles.css'
// 导入字体图标库的样式文件
import './assets/fonts/iconfont.css'
// 导入我们自定义的全局组件样式,因为是后导入的,所以可以覆盖组件库的样式
import './index.css';
/*
  导入App根组件
  注意: 应该将组件的导入放在样式导入的后面,从而避免样式覆盖的问题
*/
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);