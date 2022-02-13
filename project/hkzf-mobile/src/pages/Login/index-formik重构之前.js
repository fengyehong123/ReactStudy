import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { API } from '../../utils/api'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

/*
  登录功能
  1. 添加状态: username(账号)password(密码)
  2. 使用受控组件的方式获取表单的元素值
  3. 给form表单添加onSubmit
  4. 创建方法handleSubmit,实现表单提交
  5. 在方法中,通过username和password获取到账号和密码
  6. 使用API调用登录接口,将username和password作为参数
  7. 判断返回值status为200的时候,表示登录成功
  8. 登录成功之后,将token保存到本地存储中(hkzf_token)
  9. 返回登录之前的页面
*/
class Login extends Component {

  state = {
    username: '',
    password: ''
  }

  /*
    将输入的用户名保存到组件的状态中,e是事件对象
    React中没有Vue中的双向绑定,因此需要手动保存组件数据
  */
  getUserName = (e) => {
    /*
      没有使用解构的方式来获取的话,需要添加 e.persist(); 否则会报错
      详情参考: https://www.jianshu.com/p/bf390141fae8
    */ 
    e.persist();
    this.setState(() => {
      return {
        username: e.target.value
      }
    })
  }

  // 获取用户输入的密码(通过解构的方式来获取)
  getPassword = ({target: {value}}) => {
    this.setState(() => {
      return {
        password: value
      }
    })
  }

  // 表单提交事件方法
  handleSubmit = async (e) => {
    // 阻止表单提交时的默认行为
    e.preventDefault();
    
    const { username, password } = this.state;

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
      // 返回上一个页面
      this.props.history.go(-1);
    } else {
      // 登录失败,显示错误提示信息
      Toast.info(description, 2, null, false);
    }
    
  }

  render() {

    const { username, password } = this.state;

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        {/* 上下留白组件 */}
        <WhiteSpace size="xl" />

        {/* 登录表单,WingBlank是两翼留白组件 */}
        <WingBlank>
          <form onSubmit={this.handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={username}
                onChange={this.getUserName}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={password}
                onChange={this.getPassword}
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

export default Login
