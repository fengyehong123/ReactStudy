import React from 'react'  
import { Flex } from 'antd-mobile'

import styles from './index.module.css'

/*
  标题高亮状态:
    提升至父组件Filter中(状态提升),由父组件提供高亮状态,子组件通过props接收状态来实现高亮
  原则:
    单一数据源!!!也就是说,状态只应该有一个组件提供并且提供操作状态的方法,其他组件直接使用
    该组件中的状态和操作状态的方法即可.
*/
/*
  1. 通过props接收高亮状态的对象titleSelectedStatus
  2. 遍历titleList数组,渲染标题列表
  3. 判断高亮对象中当前的标题是否是高亮,如果是的话,就添加高亮类
  4. 给标题绑定单击事件,在事件中调用父组件传过来的方法onClick
  5. 将当前标题type,通过onClick的参数,传递给父组件
  6. 父组件接收到当前的type,修改该标题中的选中状态为true
*/

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default function FilterTitle({ titleSelectedStatus, onClick}) {

  return (
    <Flex align="center" className={styles.root}>
      {
        // 动态创建标题栏
        titleList.map(item => {
          
          // 获取当前标题栏的选中状态()
          const isSelected = titleSelectedStatus[item.type];

          return (
            // 给每一个标题栏添加点击事件,点击之后调用父组件传递来的方法修改标题的高亮状态
            <Flex.Item key={item.type} onClick={() => onClick(item.type)}>
              {/* 如果当前的标题被选中,则添加选中类名selected */}
              <span className={[styles.dropdown, isSelected ? styles.selected : ''].join(' ')}>
                {/* 渲染标题栏标题数据 */}
                <span>{item.title}</span>
                <i className="iconfont icon-arrow" />
              </span>
            </Flex.Item>
          )
        })
      }
    </Flex>
  )
}
