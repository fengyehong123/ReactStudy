import React, { Component } from 'react'

import { Link } from 'react-router-dom'
// 导入宫格组件
import { Grid, Button, Modal } from 'antd-mobile'
import { BASE_URL } from '../../utils/url'
import { API } from '../../utils/api'
// 导入认证工具类
import * as auth from '../../utils/auth'

import styles from './index.module.css'

// 菜单数据
const menus = [
  // 如果菜单是可以点击的,是有to属性的
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

// Modal对话框的alert方法
const alert = Modal.alert;

export default class Profile extends Component {

  state = {
    // 用户是否登录
    isLogin: auth.isAuth(),
    // 用户的个人信息
    userInfo: {
      nickname: '',
      avatar: ''
    }
  }

  // 钩子函数,一进入页面就调用
  componentDidMount() {
    this.getUserInfo();
  }

  // 获取用户个人资料
  async getUserInfo() {

    // 如果用户未登录
    if (!this.state.isLogin) {
      return;
    }

    // 如果用户已经登录,发送请求,获取用户资料
    const res = await API.get('/user', {
      /*
        因为我们已经配置了请求拦截器,所以不需要在每次请求都添加请求头了
        headers: {
          authorization: auth.getToken()
        }
      */
    })

    // 只有当状态值为200的时候,才表示请求成功
    if (res.data.status === 200) {
      const { nickname, avatar } = res.data.body;
      this.setState(() => {
        return {
          userInfo: {
            nickname,
            avatar: BASE_URL + avatar
          }
        }
      })
    } else {
      // 当token异常或者token失效的话,应该将 isLogin 设置为false
      this.setState(() => {
        return {
          isLogin: false,
        }
      })
    }
  }

  // 退出
  logout = () => {

    alert('提示', '是否确定退出?', [
      {text: '取消'},
      {text: '退出', onPress: async () => {
        // 调用用户退出接口
        await API.post('/user/logout', null, {
          headers: {
            authorization: auth.getToken(),
          }
        })

        // 用户退出之后,移除本地的token
        auth.removeToken();

        // 清空组件中的数据
        this.setState(() => {
          return {
            isLogin: '',
            userInfo: {
              avatar: '',
              nickname: ''
            }
          }
        })
        
      }}
    ])
  }

  render() {
    const { history } = this.props
    const { isLogin, userInfo: { nickname, avatar } } = this.state;

    return (
      <div className={styles.root}>

        {/* 个人信息 */}
        <div className={styles.title}>
          <img className={styles.bg} src={BASE_URL + '/img/profile/bg.png'} alt="背景图" />
          <div className={styles.info}>
            {/* 个人头像 */}
            <div className={styles.myIcon}>
              {/* 登录之后显示用户头像,否则显示默认的头像 */}
              <img className={styles.avatar} src={avatar || DEFAULT_AVATAR} alt="icon" />
            </div>

            <div className={styles.user}>
              <div className={styles.name}>{nickname || '游客'}</div>
              {
                isLogin ? (
                  // 登录后展示
                  <>
                    <div className={styles.auth}>
                      <span onClick={this.logout}>退出</span>
                    </div>
                    <div className={styles.edit}>
                      编辑个人资料
                      <span className={styles.arrow}>
                        <i className="iconfont icon-arrow" />
                      </span>
                    </div>
                  </>
                ) : (
                  // 未登录展示
                  <div className={styles.edit}>
                    <Button
                      type="primary"
                      size="small"
                      inline
                      onClick={() => history.push('/login')}
                    >
                      去登录
                    </Button>
                  </div>
                )
              }
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          // 九宫格菜单的数据源
          data={menus}
          // 一共三列
          columnNum={3}
          // 不设置边框
          hasLine={false}
          // 渲染九宫格中的每一项
          renderItem={item =>
            // 如果项目中有to属性,就渲染Link组件,表示该菜单是可导航的
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className={styles.menuItem}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>

      </div>
    )
  }
}
