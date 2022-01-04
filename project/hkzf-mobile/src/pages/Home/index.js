import React from 'react'
// 导入路由
import { Route } from 'react-router-dom'
// 导入 TabBar
import { TabBar } from 'antd-mobile'

// 导入TabBar菜单的组件
import News from '../News'
import Index from '../Index'
import HouseList from '../HouseList'
import Profile from '../Profile'

// 导入组件自己的样式文件
import './index.css'

// TabBar 数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]

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

  // 渲染 TabBar.Item
  renderTabBarItem() {
    // 遍历tabItems数据,动态的创建选项卡
    return tabItems.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        // 动态的创建图标
        icon={<i className={`iconfont ${item.icon}`} />}
        // 选中时的图标
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        // 当前路由地址和当前Tab相同的话,设置为选中状态
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          // 当按压下按钮之后,将选中的Tab设置为当前
          this.setState({
            selectedTab: item.path
          })

          // 实现路由切换,跳转到相应的组件
          this.props.history.push(item.path)
        }}
      />
    ))
  }

  render() {
    return (
      <div className="home">

        {/* 渲染子路由 */}
        <Route path="/home/news" component={News} />
        {/* 
            exact: 精确匹配
            父级路由和子级路由是同一个路由地址,只有当路由地址为/home的时候,才会匹配到Index组件
            如果我们不添加exact的话,当访问/home/list的时候,由于url中含有/home,Index组件也会被加载出来
        */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/profile" component={Profile} />

        {/* 动态的创建TabBar */}
        <TabBar 
          tintColor="#21b97a" 
          barTintColor="white"
          // 设置不渲染内容
          noRenderContent={true}
        >
          {/* 调用渲染的方法 */}
          {this.renderTabBarItem()}
        </TabBar>
      </div>
    )
  }
}
