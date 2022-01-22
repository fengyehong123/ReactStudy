import React from 'react'
import { NavBar } from 'antd-mobile'
// 导入withRouter高阶组件
import { withRouter } from 'react-router-dom'
// 导入props校验的包
import PropTypes from 'prop-types'

// 导入自定义封装组件的样式
import './index.scss'

/*
    自定义封装组件
    { children, history, onLeftClick } 相当于 const { children, history, onLeftClick } = props
    ❗❗注意: 默认情况下,只有路由Route直接渲染的组件才能获取到路由信息(比如:history.go()等)
    我们自定义的NavHeader组件并没有被路由直接渲染,因此无法从props中获取出history,只有像Map等
    直接被路由渲染的组件才能从props中获取到路由信息
    ⏹如果需要在其他组件中获取到路由信息可以通过 withRouter 这个高阶组件来获取

    1. 从react-router-dom中导入withRouter高阶组件
    2. 使用withRouter高阶组件包装我们自定义的NavHeader组件
        目的: 包装之后,就可以在组件中获取到当前路由的信息了
    3. 从props中解构出history对象(如果不使用withRouter包装是无法从props中获取到history的)
    4. 调用history.go()实现返回上一页的功能
    5. 从props中解构出 onLeftClick 函数,实现自定义 < 按钮的点击事件
*/ 
function NavHeader({ children, history, onLeftClick }) {

    // 默认的点击行为,点击左侧的图标按钮,返回上一个页面
    const defaultHandler = () => history.go(-1);

    return (
        <NavBar
            className="navbar"
            mode="light"
            icon={<i className="iconfont icon-back"/>}
            // 如果用户传入了onLeftClick参数,就使用用户自定义的行为,否则使用默认点击行为
            onLeftClick={onLeftClick || defaultHandler}
        >
            {/* 使用children属性来动态传参数 */}
            {children}
        </NavBar>
    )
}

/*
    给自定义组件添加props校验
    1. 安装: yarn add prop-types
    2. 导入ProTypes: import PropsType from 'prop-types'
    3. 添加propes校验
*/
NavHeader.propTypes = {
    /*
        props中的两个属性校验
    */ 
    // 字符串类型且为必填项
    children: PropTypes.string.isRequired,
    // 函数类型
    onLeftClick: PropTypes.func
}

/*
    使用withRouter高阶组件包裹NavHeader组件,使其拥有获得路由信息的功能
    withRouter(NavHeader)函数的返回值也是一个组件
*/ 
export default withRouter(NavHeader)
