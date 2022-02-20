import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity } from '../../../utils/city'
import { API } from '../../../utils/api'

import styles from './index.module.css'

export default class Search extends Component {

  // 当前城市id
  cityId = getCity().value;
  // 定时器id
  timerId = null;

  state = {
    // 搜索框的值
    searchTxt: '',
    // 页面上的提示列表(里面保存的是房源的相关信息)
    tipsList: []
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  /*
    关键词搜索小区信息
    1. 给SearchBar组件,添加onChange配置项,获取文本框的值.
    2. 判断当前文本框的值是否为空
    3. 如果为空,清空列表,然后return,不再发送请求
    4. 如果不为空,使用API发送请求,获取小区的数据
    5. 使用定时器setTimeout来延迟搜索,提升性能
  */
  handleSearchTxt = (value) => {

    // 将搜索关键词保存到组件的状态中
    this.setState(() => {
      return {
        searchTxt: value,
      }
    })

    /*
      因为将搜索关键词保存到组件的操作是异步更新的
      所以不能直接通过 searchTxt 来判断输入的关键词是否为空
      因此需要通过value来判断输入的关键词是否为空
    */ 
    // 如果文本框输入的值是空的话,就清空提示列表
    if (!value) {
      return this.setState(() => {
        return {
          tipsList: []
        }
      })
    }

    // 清除上一次的定时器
    clearTimeout(this.timerId);

    /*
      设置定时器,当500毫秒之后,发送请求,模拟js防抖节流的效果
      添加定时器可以在输入框中输入关键词的时候防止多次发送无效请求
    */
    this.timerId = setTimeout(async () => {

      // 如果输入的文本框的值不为空,就获取小区数据
      const res = await API.get('/area/community', {
        params: {
          // 当前输入的搜索关键词
          name: value,
          // 当前定位城市的id
          id: this.cityId,
        }
      })
      
      // 更新查询到的关键词所对应的列表
      this.setState(() => {
        return {
          tipsList: res.data.body,
        }
      })

    }, 500);

  }

  render() {

    const { history } = this.props
    const { searchTxt } = this.state

    return (
      
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handleSearchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
