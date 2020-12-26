import React from 'react'
// 导入路由模块
/*
  HashRouter: 
    表示一个路由的根容器,将来所有和路由相关的东西都要包裹在HashRouter里面
    而且一个网站中,只需要使用一次HashRouter就可以了
  Route: 
    表示一个路由规则
    在Route上有两个比较重要的属性 Path 和 component
  Link: 
    表示一个路由的链接,就好比vue中的<router-link to=""></router-link>
*/
import {HashRouter, Route, Link} from 'react-router-dom'
// 导入我们自定义的组件
import Home from './components/Home.jsx'
import About from './components/About.jsx'
import Movie from './components/Movie.jsx'

// 导入日期选择组件
import {DatePicker} from 'antd'


export default class App extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

        }
    }

    render() {
        return (
            /*
                1. 当使用HashRouter把App根组件的元素包裹起来之后,网站就已经启用路由了
                2. 在一个HashRouter中,只能有一个唯一的一个根元素
                3. 在一个网站中,只需要使用唯一的一次<HashRouter></HashRouter>就可以了
            */ 
            <HashRouter>
                <div>
                    <h1>这个是网站的APP根组件</h1>
                    <DatePicker></DatePicker>
                    <hr/>

                    <Link to="/home">首页</Link>&nbsp;&nbsp;
                    {/* 
                        🙄路由传参
                    */}
                    <Link to="/movie/top100/10">电影</Link>&nbsp;&nbsp;
                    <Link to="/about">关于</Link>&nbsp;&nbsp;
                    <hr/>

                    {/* 
                        1. Route创建的标签就是路由规则,其中path表示要匹配的路由;而component表示要展示的组件
                        2. 在vue中有个router-view的路由标签,专门用来放置匹配到的路由组件,
                           但是在react-router中,并没有类似于这样的标签,而是直接把Route标签当做坑(占位符)来使用
                        3. Route具有两种身份:
                            3.1 它是一个路由匹配规则
                            3.2 它是一个占位符,表示将来匹配到的组件都放到这个位置
                    */}
                    <Route path="/home" component={Home}></Route>
                    <hr/>
                    {/* 
                        ⭕注意:
                            1. 默认情况下,路由中的规则是模糊匹配的,如果路由可以部分匹配成功,就会展示这个路由对应的组件
                            2. 如果想让路由规则进行精确匹配可以为Route添加exact属性,表示启用精确匹配模式
                            3. 如果要匹配参数的话,可以在匹配规则中使用 :修饰符,表示这个位置匹配到的是参数
                            4. 如果想要从路由规则中提取匹配到的参数进行使用的话,可以使用this.props.match.params.*** 来获取
                    */}
                    <Route path="/movie/:type/:id" component={Movie} exact></Route>
                    <hr/>
                    <Route path="/about" component={About}></Route>
                </div>
            </HashRouter>
        );
    }
}