import React, { Component, createRef } from 'react'
// 导入props校验的包
import PropTypes from 'prop-types'

import styles from './index.module.css'

/* 
  条件筛选栏吸顶功能实现步骤：

  1. 封装 Sticky 组件,实现吸顶功能。
  2. 在 HouseList 页面中,导入 Sticky 组件。
  3. 使用 Sticky 组件包裹要实现吸顶功能的 Filter 组件。
  4. 在 Sticky 组件中,创建两个 ref 对象(placeholder,content),分别指向占位元素和内容元素。
  5. 组件中,监听浏览器的 scroll 事件(注意销毁事件)。
  6. 在 scroll 事件中,通过 getBoundingClientRect() 方法得到筛选栏占位元素当前位置（top）。
  7. 判断 top 是否小于 0(是否在可视区内)。
  8. 如果小于,就添加需要吸顶样式(fixed),同时设置占位元素高度(与条件筛选栏高度相同)。
  9. 否则,就移除吸顶样式,同时让占位元素高度为0。
*/
class Sticky extends Component {

  // 创建ref对象,通过DOM的方式操作绑定的div元素
  placeholder = createRef();
  content = createRef();

  // scroll事件的回调处理程序
  handleScroll = () => {

    // 获取需要固定高度的组件的高度
    const { height } = this.props;

    // 获取ref对象,获取绑定的DOM对象
    const placeholderElement = this.placeholder.current;
    const contentElement = this.content.current;

    // 通过DOM对象中的getBoundingClientRect()方法,获取距离顶部的距离
    const { top } = placeholderElement.getBoundingClientRect();

    if (top < 0) {

      // 给Filter组件添加吸顶的样式
      contentElement.classList.add(styles.fixed);
      // 将占位符元素设置高度,防止Filter组件吸顶之后,房源突然向上跳一下
      placeholderElement.style.height = `${height}px`;
    } else {
      // 给Filter组件取消吸顶的样式
      contentElement.classList.remove(styles.fixed);
      // 将占位符元素取消设置高度
      placeholderElement.style.height = '0px';
    }
  }

  // 监听scroll事件
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  // 组件卸载之后,移除scroll的监听事件
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeholder} />

        {/* 内容元素,也就是存放传入到该组件中的Filter组件 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }
}

Sticky.propTypes = {
  // 高度为数字类型且为必填项
  height: PropTypes.number.isRequired
}

export default Sticky
