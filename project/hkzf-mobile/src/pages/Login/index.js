import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/
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
  handleSubmit = (e) => {
    // 阻止表单提交时的默认行为
    e.preventDefault();
    console.log(this.state);
    
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
