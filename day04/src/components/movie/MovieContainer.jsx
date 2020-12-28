import React from 'react'

// 布局相关的组件
import { Layout, Menu} from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
// 导入路由相关的组件
import { Link, Route, Switch } from 'react-router-dom'
// 导入电影列表组件(路由组件页面)
import MovieList from './MovieList.jsx'
// 导入电影详情组件
import MovieDetail from './MovieDetail.jsx'

export default class MovieContainer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Layout style={{ height: '100%' }}>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={[window.location.hash.split('/')[2]]}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item key="in_theaters">
                            <Link to="/movie/nowPlaying/1">正在热映</Link>
                        </Menu.Item>
                        <Menu.Item key="coming_soon">
                            <Link to="/movie/comingSoon/1">即将上映</Link>
                        </Menu.Item>
                        <Menu.Item key="top250">
                            <Link to="/movie/top250/1">Top250</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout style={{ paddingLeft: '1px' }}>
                    <Content style={{ background: '#fff', padding: 10, margin: 0, minHeight: 280 }}>
                        {/* 
                            当点击路由链接的时候,链接所对应的路由组件会显示在这个地方
                            在匹配路由规则的时候,这个提供了两个参数
                            如果想要从路由规则中提取参数,需要使用 this.props.match.params来获取
                        */}

                        {/* 
                            我们点击电影之后,会通过下面的路由跳转到电影详情页面
                            /movie/detail/2158490
                            但是由于我们下面的两个路由都会被匹配到,因此程序会报错
                            默认是模糊匹配,但是就算我们开启了精确匹配,也会从上到下,把所有的路由规则匹配一遍
                            <Route path="/movie/:type/:page" component={MovieList}></Route>
                            <Route path="/movie/detail/:id" component={MovieDetail}></Route>
                            
                            我们可以使用路由组件中的Switch组件,如果前面的路由规则优先匹配到了,则放弃匹配后边的路由
                        */}
                        <Switch>
                            <Route path="/movie/detail/:id" component={MovieDetail}></Route>
                            <Route path="/movie/:type/:page" component={MovieList}></Route>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}