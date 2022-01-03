import React from 'react'
// 导入路由
import {Route} from 'react-router-dom'
// 导入TabBar组件
import { TabBar } from 'antd-mobile';

// 导入我们自定义的组件
import News from '../News'
import Index from '../Index'
import HouseList from '../HouseList';
import Profile from '../Profile';

// 导入组件自己的样式文件
import './index.css'

export default class Home extends React.Component {

    constructor(props) {
        super(props);
       
        this.state = {
            // 从地址栏中获取,页面初始化时默认选中的Tab菜单
            selectedTab: this.props.location.pathname,
            // 是否隐藏TabBar
            hidden: false,
            // 是否全屏
            fullScreen: false,
        };
    }

    render() {
        return (
            <div className="home">

                {/* 
                    渲染Home组件中的子路由
                    当我们点击Tab菜单栏的时候,可以通过路由跳转到相应的组件
                */}
                <Route path="/home/news" component={News}></Route>
                <Route path="/home/index" component={Index}></Route>
                <Route path="/home/list" component={HouseList}></Route>
                <Route path="/home/profile" component={Profile}></Route>

                {/* TabBar菜单栏 */}
                <TabBar
                // 选中时的颜色
                tintColor="#21b97a"
                barTintColor="white"
                // 设置不渲染内容
                noRenderContent={true}
                >
                    <TabBar.Item
                        title="首页"
                        key="首页"
                        // 设置首页的图标
                        icon={<i className="iconfont icon-ind"></i>}
                        // 选中时的图标
                        selectedIcon={<i className="iconfont icon-ind"></i>}
                        // 当前selectedTab的为/home/index的话,图标设置为选中状态
                        selected={this.state.selectedTab === '/home/index'}
                        // 按下事件
                        onPress={() => {
                            // 当按压下按钮之后,将选中的Tab设置为当前
                            this.setState({
                                selectedTab: '/home/index',
                            });

                            // 实现路由切换,跳转到相应的组件
                            this.props.history.push('/home/index')
                        }}
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<i className="iconfont icon-findHouse"></i>}
                        selectedIcon={<i className="iconfont icon-findHouse"></i>}
                        title="找房"
                        key="找房"
                        selected={this.state.selectedTab === '/home/list'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home/list',
                            });

                            // 实现路由切换,跳转到相应的组件
                            this.props.history.push('/home/list')
                        }}
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<i className="iconfont icon-infom"></i>}
                        selectedIcon={<i className="iconfont icon-infom"></i>}
                        title="资讯"
                        key="资讯"
                        selected={this.state.selectedTab === '/home/news'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home/news',
                            });
                            // 实现路由切换,跳转到相应的组件
                            this.props.history.push('/home/news')
                        }}
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<i className="iconfont icon-my"></i>}
                        selectedIcon={<i className="iconfont icon-my"></i>}
                        title="我的"
                        key="我的"
                        selected={this.state.selectedTab === '/home/profile'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home/profile',
                            });
                            // 实现路由切换,跳转到相应的组件
                            this.props.history.push('/home/profile')
                        }}
                    >
                    </TabBar.Item>
                </TabBar>
            </div>
        );
    }
}