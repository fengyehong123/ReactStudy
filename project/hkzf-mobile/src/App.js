import React from "react";
// 导入自定义的组件
import CityList from './pages/CityList'
import Home from './pages/Home'
// 导入路由组件
import {BrowserRouter, Route, Link} from 'react-router-dom'
// 导入antd-mobile的样式(在入口文件处全局导入一次)
import 'antd-mobile/dist/antd-mobile.css'

function App() {
  return (
    // 要想使用路由,需要使用Router包裹根组件
    <BrowserRouter>
      <div className="App">

        {/* 配置路由所对应的组件 */}
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
