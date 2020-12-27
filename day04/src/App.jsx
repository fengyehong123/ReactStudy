// 项目的根组件
import React from 'react'
// 导入路由的相关组件
import {HashRouter, Route, Link} from 'react-router-dom'
// 导入需要的Ant Design组件
import { Layout, Menu} from 'antd';
const { Header, Content, Footer } = Layout;
// 因为我们开启了样式模块化,因此我们不能自己手写.css样式
// 我们导入写好的.scss样式
import styles from './css/app.scss'
// 导入路由相关的组件页面
import HomeContainer from './components/home/HomeContainer.jsx'
import AboutContainer from './components/about/AboutContainer.jsx'
import MovieContainer from './components/movie/MovieContainer.jsx'

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    UNSAFE_componentWillMount() {
        // 获取地址栏的路由信息
        // console.log(window.location.hash.split("/"));  // ["#", "movie"]
    }

    render() {
        return (
            <HashRouter>
                {/* 所有的内部都应该包裹在Layout标签之内 */}
                <Layout className="layout" style={{height: '100%'}}>

                    {/* Header头部区域 */}
                    <Header>
                        <div className={styles.logo} />
                        {/* 
                            defaultSelectedKeys={[window.location.hash.split("/")[1]]}
                                指定默认选中的选项卡,具体默认选中哪个选项卡是由路由地址决定的
                        */}
                        <Menu 
                            theme="dark" 
                            mode="horizontal" 
                            defaultSelectedKeys={[window.location.hash.split("/")[1]]}
                            style={{ lineHeight: '64px' }}
                        >
                            <Menu.Item key="home">
                                {/* 添加路由地址 */}
                                <Link to="/home">首页</Link>
                            </Menu.Item>
                            <Menu.Item key="movie">
                                <Link to="/movie/in_theaters/1">电影</Link>
                            </Menu.Item>
                            <Menu.Item key="about">
                                <Link to="/about">关于</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    
                    {/* 中间的内容区域 */}
                    <Layout style={{ backgroundColor: '#fff', flex: 1 }}>
                        {/* 放置路由组件 */}
                        <Route path="/home" component={HomeContainer}></Route>
                        <Route path="/movie" component={MovieContainer}></Route>
                        <Route path="/about" component={AboutContainer}></Route>
                    </Layout>

                    {/* Footer底部区域 */}
                    <Footer style={{ textAlign: 'center' }}>
                        传智播客 ©2017 黑马程序员
                    </Footer>
                </Layout>
            </HashRouter>
        );
    }
}