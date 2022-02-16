import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils/auth'

/*
    封装AuthRoute鉴权路由组件
    1. 创建组件 AuthRoute 并导出
    2. 在AuthRoute组件中返回Route组件(在Route基础上做了一层包装,用于实现自定义功能)
    3. 给Route组件添加render方法,指定该组件要渲染的内容(类似于 component 属性)
    4. 在render方法中,调用 isAuth() 判断是否登录
    5. 如果登录了,就渲染当前组件(通过参数component获取到要渲染的组件,需要重命名)
    6. 如果没有登录,就重定向到登录页面,并指定登录成功后要跳转到的页面路径
    7. 将 AuthRoute 组件接收到的props原样传递给 Route组件(保证与 Route 组件使用的方式相同)
    8. 使用AuthRoute 组件配置的路由规则,验证能否实现页面的登录访问控制
*/

// <AuthRoute path="..." component={...}></AuthRoute>
const AuthRoute = ({ component: Component, ...rest }) => {
    return (
        // rest属性存放 path="..." 等属性
        <Route {...rest} render={props => {

            const isLogin = isAuth();
            if (isLogin) {
                /*
                    已经登录,渲染传入的Component组件
                    将props传递给组件,组件中才能获取到路由的相关信息
                */ 
                return <Component {...props} />
            } else {
                /*
                    未登录,渲染重定向组件
                    通过to属性指定跳转的路由信息
                */ 
                return <Redirect to={{
                    pathname: '/login',
                    state: {
                        // 未登录时,要访问的页面url,我们可以在登录页面获取到该url,当登录成功之后,可以直接跳转到该url
                        from: props.location
                    }
                }} />
            }

        }} />
    )
}

export default AuthRoute