import React from 'react'

import PropTypes from 'prop-types'

import { BASE_URL } from '../../utils/url'
import styles from './index.module.css'

/*
  房源不存在时的展示的组件
*/
const NoHouse = ({ children }) => (

  <div className={styles.root}>
    <img
      className={styles.img}
      src={BASE_URL + '/img/not-found.png'}
      alt="暂无数据"
    />
    <p className={styles.msg}>{children}</p>
  </div>
)

// 传递参数校验
NoHouse.propTypes = {
  // node表示任何可以渲染的内容
  children: PropTypes.node.isRequired
}

export default NoHouse
