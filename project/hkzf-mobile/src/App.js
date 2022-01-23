import React from "react";
// 导入自定义的组件
import CityList from './pages/CityList'
import Home from './pages/Home'
// 导入地图组件
import Map from './pages/Map'
/*
  ❗❗组件间样式覆盖的问题
  ⏹ 问题:CityList组件和Map组件都使用了我们封装的NavHeader组件
      如果CityList组件使用.navbar起类名的方式将NavHeader组件背景颜色修改为蓝色
      而Map组件使用.navbar起类名的方式将NavHeader组件背景颜色修改为红色
      最终页面上显示的效果为: Map组件和CityList组件中的NavHeader组件背景颜色都是红色

  ⏹ 原因:在配置路由的时候,CityList和Map组件都被导入到项目中,那么组件的样式也就被导入到项目中了.
      如果组件之间的样式的名称相同,那么一个组件中的样式就会在另一个组件中也生效,从而造成组件之间样式互相覆盖的问题
      因为Map组件和CityList组件都使用.navbar起类名的方式来修改NavHeader组件中背景颜色,而CityList组件先于Map组件导入,
      因此Map组件中定义的样式会覆盖CityList中定义的样式.

  ⏹ 结论:默认情况下,只要导入了组件,不管组件有没有显示在页面中,组件的样式就会生效

  ⏹ 如何解决:
        1. 传统方式: 手动处理(起不同的类名)
        2. CSS in JS

  ⏹ CSS Modules
      原理: 通过对CSS类名进行重命名,保证每个类名的唯一性,从而避免样式冲突问题
      实现方式: webpack的css-loader插件

      命名方式: BEM(Block块,Element元素,Modifier三部分组成)命名规范,比如.list_item_active
        在React脚手架中演化为: 文件名,类名,hash(随机)三部分,我们只需要指定类名即可

      使用:
        1. 创建名为[name].module.css的样式文件(React脚手架中的约定,与普通CSS作区分)
            例如: index.module.css
        2. 组件中导入该样式文件
            import styles from './index.modules.css'
        3. 通过styles对象访问对象名中的样式名称来设置样式
            <div className={styles.test}>测试</div>

      注意: 
        1. 推荐使用驼峰命名法,而非下划线方式来取类名
        2. 在样式文件中修改当前组件的样式时,推荐使用单个类名设置样式,不使用嵌套样式
          推荐: .narBar {}
          不推荐: .narbar .test {}
        3. 对于组件中已经有的全局样式(比如 .am-navbar-title),需要使用:global()来指定
*/
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
          ⏹有Tabbar的组件需要放到Home组件中,在Home组件中使用子路由
        */}
        <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
        <Route path="/home" component={Home}></Route>

        {/* ⏹没有Tabbar的组件和Home组件平级 */}
        <Route path="/citylist" component={CityList}></Route>
        {/* 
          ❗❗只有被路由直接渲染的组件才能通过props获取到路由信息,例如Map组价
            Map中使用的其他非直接被路由渲染的组件无法直接从props中获取到路由信息
            必须要使用withRouter高阶组件才可以
        */}
        <Route path="/map" component={Map}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
