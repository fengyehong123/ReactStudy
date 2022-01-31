import React, { Component } from 'react'
// 导入自定义的axios
import { API } from '../../../../utils/api'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

/*
  控制FilterPicker组件的展示和隐藏:
    1. 在Filter组件中,提供控制对话框展示或隐藏状态: openType(表示展示的对话框的类型)
    2. 在render中判断openType值为area/mode/price时,就展示FilterPicker组件以及遮罩层
    3. 在onTitleClick方法中,修改状态openType为当前type,展示对话框
    4. 在Filter组件中,提供onCancel方法,作为取消按钮和遮罩层的事件处理程序
    5. 在onCancel方法中,修改状态openType为空,隐藏对话框
    6. 将onCancel通过props传递给FilterPicker组件,在取消按钮的单击事件中调用该方法
    7. 在Filter组件中,提供onSave方法,作为确定按钮的事件处理程序,逻辑同上
*/

/*
  标题的高亮状态
    true: 表示高亮
    false: 表示不高亮
*/
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

export default class Filter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // 控制标题栏的高亮状态
      titleSelectedStatus,
      // 控制FilterPicker或者FilterMore组件的展示或者隐藏
      openType: '',
      // 所有房源的筛选条件数据
      filtersData: {}
    }

    // 改变onTitleClick函数中的this指向问题
    this.onTitleClick = this.onTitleClick.bind(this);
  }

  // 钩子函数,一进页面就调用
  componentDidMount() {
    // 获取当前城市所对应的房源查询条件
    this.getFiltersData();
  }

  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市的id,根据城市id来获取当前城市对应的房屋查询条件
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)
    
    // 将获取到的房源数据保存到组件的状态数据中
    this.setState({
      filtersData: res.data.body
    })
  }

  /*
    点击标题菜单实现高亮,type为当前点击的标题的类型
    因为父组件提供了状态值的存储,因此状态值的修改也需要父组件提供
    当点击标题的时候,让当前点击的标题高亮并且展示当前标题所对应的对话框
  */ 
  onTitleClick(type) {
    this.setState((prevState) => {
      return {
        titleSelectedStatus: {
          // 获取当前对象中所有属性的值
          ...prevState.titleSelectedStatus,
          // 将当前点击的标题对象的状态改为true(使用了ES6的动态属性名)
          [type]: true,
        },
        // 根据当前点击的标题展示相应的对话框
        openType: type,
      }
    })
  }

  // 取消隐藏对话框
  onCancel = () => {
    this.setState({
      // 当该状态值设置为空,就可以隐藏对话框
      openType: ''
    })
  }

  // 点击确定按钮,调用的函数
  onSave = () => {
    // 隐藏对话框
    this.setState({
      openType: ''
    })
  }

  // 渲染FilterPicker组件的方法
  renderFilterPicker() {

    // 解构出当前点击的标题的类型
    const { openType } = this.state;

    // 当前被点击的标题是不是下面这三个之一的时候,不渲染组件
    if(!['area', 'mode', 'price'].includes(openType)) {
      return null;
    }

    // 否则就渲染FilterPicker组件
    return <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
  }

  render() {

    // 从当前父组件的状态中解构出需要的数据
    const { titleSelectedStatus, openType } = this.state;

    return (
      <div className={styles.root}>
        {
          /*
            当前被点击的标题是下面这三个之一的时候,就展示遮罩层
            我们给遮罩层绑定了单击事件,当点击的时候,触发onCancel方法,隐藏遮罩层
          */ 
          ['area', 'mode', 'price'].includes(openType) ? <div className={styles.mask} onClick={this.onCancel} /> : null
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {
            // 调用自己封装的渲染FilterPicker组件的方法
            this.renderFilterPicker()
          }

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
