import React, { lazy } from 'react'
// 导入路由
import { Route } from 'react-router-dom'
// 导入 TabBar
import { TabBar } from 'antd-mobile'

// 导入组件自己的样式文件
import './index.css'

/*
  导入TabBar菜单的组件
  因为Index组件,一进入页面就需要访问,因此并不进行动态导入
*/ 
import Index from '../Index'

/*
  动态导入组件
  因为在App.js中已经配置了Suspense了
  所以此处不需要再用Suspense组件包裹动态导入的组件了
*/
const News = lazy(() => import('../News'))
// HouseList组件是后与当前组件的样式导入的,HouseList组件的样式会覆盖当前组件的样式
const HouseList = lazy(() => import('../HouseList'))
const Profile = lazy(() => import('../Profile'))

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

/*
  ⏹存在的问题
    点击首页导航菜单,导航到找房列表页面时,找房菜单没有高亮
  ⏹原因:
    菜单高亮实现的时候,只考虑了点击以及第一次加载Home组件的情况,但是没有考虑
    不重新加载Home组件时候的路由切换
  ⏹解决:
    在路由切换的时候,也执行菜单高亮的逻辑代码
    1. 添加componentDidUpdate钩子函数
    2. 在钩子函数中判断路由地址是否切换
        路由信息是通过props传递给组件的,因此通过比较更新前后的两个props
    3. 在路由地址切换的时候,让菜单高亮
*/

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

  /*
    在此钩子函数中,当路由地址发生变化(Home组件中的子路由被触发)的时候,就会执行
    路由信息是通过props传递给组件的,因此通过比较更新前后的两个props中的路由信息
    通过此钩子函数实现了路由被切换,但是组件没有被重新加载时也能实现菜单高亮的效果
  */ 
  componentDidUpdate(preprops) {
    console.log('上一次的路由信息', preprops);
    console.log('本次的路由信息', this.props);

    // 当更新前后的两个路由地址不同的时候,说明发生了路由切换,此时更改当前选中的Tab菜单
    if (preprops.location.pathname !== this.props.location.pathname) {
      this.setState(() => {
        return {
          selectedTab: this.props.location.pathname,
        }
      });
    }
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
