import React from 'react'

import PropTypes from 'prop-types'

import styles from './index.module.css'

// 房源列表的渲染组件
function HouseItem({ src, title, desc, tags, price, onClick, style }) {

  return (
    <div className={styles.house} style={style} onClick={onClick}>

      {/* 房源的图片 */}
      <div className={styles.imgWrap}>
        <img className={styles.img} src={src} alt="" />
      </div>

      {/* 房源的内容 */}
      <div className={styles.content}>
        {/* 房源的标题 */}
        <h3 className={styles.title}>{title}</h3>
        {/* 房源的内容 */}
        <div className={styles.desc}>{desc}</div>

        {/* 房源特性的标签 */}
        <div>
          {/* 一个房源可能会有多个标签,我们遍历渲染 */}
          {tags.map((tag, index) => {
            const tagClass = 'tag' + (index + 1)
            return (
              // 渲染不同标签所拥有的样式
              <span
                className={[styles.tag, styles[tagClass]].join(' ')}
                key={tag}
              >
                {tag}
              </span>
            )
          })}
        </div>
        
        {/* 房源的价格 */}
        <div className={styles.price}>
          <span className={styles.priceNum}>{price}</span> 元/月
        </div>

      </div>
    </div>
  )
}

// 属性校验
HouseItem.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  tags: PropTypes.array.isRequired,
  price: PropTypes.number,
  onClick: PropTypes.func
}

export default HouseItem
