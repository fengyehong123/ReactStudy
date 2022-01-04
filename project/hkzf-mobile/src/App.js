import React from "react";
// 导入自定义的组件
import CityList from './pages/CityList'
import Home from './pages/Home'
// 导入路由组件
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
// 导入antd-mobile的样式(在入口文件处全局导入一次)
import 'antd-mobile/dist/antd-mobile.css'

function App() {
  return (
    // 要想使用路由,需要使用Router包裹根组件
    <BrowserRouter>
      <div className="App">

        {/* 配置路由所对应的组件 */} 
        {/* 
          路由重定向,当我们访问默认地址的时候,重定向到/home路由,显示Index组件
          render: 是一个函数prop,用于指定要渲染的内容
          Redirect组件用于实现路由重定向,to属性指定要跳转到的路由地址
        */}
        <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
