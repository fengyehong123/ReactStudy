import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

// 导入withFormik
import { withFormik } from 'formik'

import { API } from '../../utils/api'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/
/*
  使用formik重构登录功能
  1. 安装formik
  2. 导入withFormik,使用withFormik高阶组件包裹Login组件
  3. 为withFormik提供配置对象: mapPropsToValues / handleSubmit
  4. 在Login组件中,通过props获取到values(表单元素值对象),handleSubmit,handleChange
  5. 使用values提供的值,设置为表单元素的value,使用handleChange设置为表单元素的onChange
      注意: 在给表单元素设置handleChange的时候,为了让其生效,需要给表单元素添加name属性,并且name属性的值
      与当前value名称需要相同!!!
  6. 使用handleSubmit设置为表单的onSubmit
  7. 在handleSubmit中,通过values获取到表单元素值
  8. 在handleSubmit中,完成登录逻辑
*/
class Login extends Component {

  // 因为我们使用了formik组件,因此不需要手动设置state和onChange事件来保存表单输入数据到state
  render() {

    // 通过props获取高阶组件传递进来的属性(Login组件被高阶组件withFormik所包裹)
    const { values, handleSubmit, handleChange } = this.props;

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        {/* 上下留白组件 */}
        <WhiteSpace size="xl" />

        {/* 登录表单,WingBlank是两翼留白组件 */}
        <WingBlank>
          {/* 高阶组件中的handleSubmit */}
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                // 高阶组件中的values.username
                value={values.username}
                // 高阶组件中的handleChange
                onChange={handleChange}
                // 必须给每一个表单元素提供name属性,否则onChange时,不知道处理的是那个项目
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                // 高阶组件中的values.password
                value={values.password}
                // 高阶组件中的handleChange
                onChange={handleChange}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

/*
  使用withFormik高阶组件包装Login组件,为Login组件提供属性和方法
  返回的是被高阶组件包裹之后的Login组件
*/ 
Login = withFormik({
  // 为组件提供状态(表单输入的项目)
  mapPropsToValues: () => ({ username: '', password: '' }),
  // 为表单提供提交事件(当表单提交的时候,就会触发该函数)
  handleSubmit: async (values, { props }) => {
    
    // 解构出用户输入的账号和密码
    const { username, password } = values;

    // 调用登录的接口
    const res = await API.post('/user/login', {
      username,
      password
    });

    // 解构后端返回的值
    const {status, body, description} = res.data;
    if (status === 200) {
      // 将token值保存到浏览器中
      localStorage.setItem('hkzf_token', body.token);
      /*
        返回上一个页面
        注意: 无法在该方法汇总通过this.props来获取到路由信息(因为this指向当前回调函数,并不指向该组件)
        通过handleSubmit方法的第二个参数中解构出props来使用props
      */ 
      props.history.go(-1);
    } else {
      // 登录失败,显示错误提示信息
      Toast.info(description, 2, null, false);
    }

  }
})(Login)

// 注意: 此处返回的是被高阶组件包装后的Login组件
export default Login
