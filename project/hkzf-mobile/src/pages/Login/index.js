import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

// 导入withFormik
import { withFormik, Form, Field, ErrorMessage } from 'formik'
// 导入Yup表单校验
import * as Yup from 'yup'

import { API } from '../../utils/api'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 表单验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

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

  给登录功能添加表单验证
  1. 安装yup,导入Yup
  2. 在withFormik中添加配置项validationSchema,使用Yup添加表单校验规则
  3. 在Login组件中,通过props获取到errors(错误信息)和touched(是否访问过,注意:需要给表单元素添加handleBlur处理失去焦点事件才生效)
  4. 在表单元素中,通过这两个对象展示表单校验的错误信息

  简化表单处理
  1. 导入Form组件,替换form元素,去掉onsubmit
  2. 导入Field组件,替换input表单元素去掉onChange,onBlur,value
  3. 导入ErrorMessage组件,替换原来的错误消息逻辑代码
  4. 去掉所有的props
*/
class Login extends Component {

  // 因为我们使用了formik组件,因此不需要手动设置state和onChange事件来保存表单输入数据到state
  render() {

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        {/* 上下留白组件 */}
        <WhiteSpace size="xl" />

        {/* 登录表单,WingBlank是两翼留白组件 */}
        <WingBlank>
          {/* 使用Form组件替换form元素,简化表单处理 */}
          <Form>
            {/* 账号 */}
            <div className={styles.formItem}>
              {/* 使用Field组件替换input输入框 */}
              <Field 
                className={styles.input}  
                name="username"
                placeholder="请输入账号">
              </Field>
            </div>
            {/* 
              校验失败后,展示的错误信息
              name="username" 代表展示username的错误信息
              component代表要把ErrorMessage组件最终渲染为div元素
            */}
            <ErrorMessage className={styles.error} name="username" component='div'></ErrorMessage>

            {/* 密码 */}
            <div className={styles.formItem}>
              {/* 使用Field组件替换input输入框 */}
              <Field 
                className={styles.input}  
                type="password"
                name="password"
                placeholder="请输入密码">
              </Field>
            </div>
            <ErrorMessage className={styles.error} name="password" component='div'></ErrorMessage>

            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>

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
  // 添加表单校验规则
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线'),
  }),
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
    // 登录成功
    if (status === 200) {
      // 将token值保存到浏览器中
      localStorage.setItem('hkzf_token', body.token);
      
      // 当props.location.state为空时,说明是直接进入的登录页面,登录成功之后返回上一个页面即可
      if (!props.location.state) {
        /*
          返回上一个页面
          注意: 无法在该方法汇总通过this.props来获取到路由信息(因为this指向当前回调函数,并不指向该组件)
          通过handleSubmit方法的第二个参数中解构出props来使用props
        */ 
        props.history.go(-1);
      } else {
        /*
          如果props.location.state不为空,说明未登录却访问了登录之后才能看的页面,
          然后被重定向到Login登录页面,
          这个时候props.location.state中会含有原先页面的url(我们在鉴权组件AuthRoute中进行了配置)
        */ 
        /*
          props.history.replace()和props.history.push()的区别
          ※假设Map地图页面是登录之后才能访问的页面
          当我们从首页点击右上角地图图标的时候,访问顺序如下 首页 -> Login登录页面 -> Map地图页面

          当我们进入地图页面之后,点击左上角的返回按钮的时候
          1. 如果是props.history.push()的情况下,访问路径被记录在这样的数组里 ['home', 'login', 'map']
              所以当我们在Map页面点击返回上一个页面的时候,会找到第二个元素 login, 跳转到Login登录页面
          2. 如果是props.history.replace()的情况下,当我们访问到Login组件的时候,访问的路径被记录在这样的数组里
              ['home', 'login'],我们登录成功之后,进入Map页面,因为使用的是replace(),所以 /login 会被替换为 /map
              也就说数组变成了['home', 'map'],所以在map页面返回前一个页面的时候,跳转到的是 /home 而不是 /login
        */
        props.history.replace(props.location.state.from.pathname);
      }
    } else {
      // 登录失败,显示错误提示信息
      Toast.info(description, 2, null, false);
    }

  }
})(Login)

// 注意: 此处返回的是被高阶组件包装后的Login组件
export default Login
