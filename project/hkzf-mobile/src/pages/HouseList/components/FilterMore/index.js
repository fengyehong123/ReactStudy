import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

/*
  获取选中值以及设置高亮:
  1. 在state中添加状态 selectedValues(表示选中项的值)
  2. 给标签绑定点击事件,通过参数获取到当前项的value
  3. 判断selectedValues中是否包含当前项的value值
  4. 如果不包含,就将当前项的value添加到selectedValues数组中
  5. 如果包含,就从selectedValues数组中移除(使用数组的splice方法,根据索引号删除)
  6. 在渲染标签时,判断selectedValues数组中,是否包含当前项的value,如果包含,就添加高亮类
*/
export default class FilterMore extends Component {

  state = {
    // 当前选中项的值
    selectedValues: []
  }

  // Tag点击方法,将Tag对应的值保存到组件的状态中
  onTagClick(value) {

    const { selectedValues } = this.state;
    // 创建新数组
    const newSelectedValues = [...selectedValues];
    if (!selectedValues.includes(value)) {
      // 没有当前项的值
      newSelectedValues.push(value);
    } else {
      // 如果包含当前项目的值的话,获取包含项目对应的index值
      const index = newSelectedValues.findIndex(item => item === value);
      // 根据index从数组中删除对应的项目
      newSelectedValues.splice(index, 1);
    }

    // 更新组件中项目的选中状态
    this.setState(() => {
      return {
        selectedValues: newSelectedValues
      }
    })
  }

  // 渲染标签
  renderFilters(data) {

    // 获取标签的选中状态
    const { selectedValues } = this.state;

    return data.map(item => {

      // 判断选中状态数组中是否包含当前Tag
      const isSelected = selectedValues.includes(item.value);
      return (
        <span key={item.value} className={[styles.tag, isSelected ? styles.tagActive: ''].join(' ')} 
          // 将当前点击的Tag所对应的值通过onTagClick函数保存到组件的状态中
          onClick={() => this.onTagClick(item.value)}>
          {item.label}
        </span>
      )
    })
  }

  // 取消按钮的事件处理程序
  onCancel = () => {

    // 清空所有的选中值
    this.setState(() => {
      return {
        selectedValues: []
      }
    })
  }

  // 点击确定按钮的处理方法
  onOk = () => {
    // 从父组件传递过来的数据中解构数据
    const { type, onSave } = this.props;

    // 传入参数(类型和当前组件选中的值),调用父组件传递来的方法
    onSave(type, this.state.selectedValues);
  }

  render() {

    // 解构出父组件传递来的数据
    const {
      data: {
        roomType,
        oriented,
        floor,
        characteristic
      }
    } = this.props;

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 
          底部按钮
          1. 设置FilterFooter组件的取消按钮文字为: 清除
          2. 点击取消按钮的时候,清空所有选中项的值(selectedValues: [])
          3. 点击确定按钮的时候,将当前选中项的值和type传递给Filter父组件
          4. 在Filter父组件的onSave方法中,接收传递过来的选中值,更新状态selectedValues
          说明:
            type和onSave都由父组件通过props传递给该组件
        */}
        <FilterFooter
          className={styles.footer} 
          cancelText="清除"
          // 点击取消按钮的时候,清空所有的选中项目
          onCancel={this.onCancel}
          onOk={this.onOk}
        />
      </div>
    )
  }
}
