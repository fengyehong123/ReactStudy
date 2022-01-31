import React from 'react'
import { Flex } from 'antd-mobile';

// 导入我们自定义的导航栏组件
import SearchHeader from '../../components/SearchHeader'
// 导入条件筛选栏组件
import Filter from './components/Filter'

// 导入当前组件的样式
import styles from './index.module.css'

// 获取当前定位城市的信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'));

export default class HouseList extends React.Component {
    
    render() {
        return (
            <div>
                <Flex className={styles.header}>
                    {/* 点击返回按钮,返回上一页 */}
                    <i className="iconfont icon-back" onClick={() => {
                        this.props.history.go(-1);
                    }}></i>
                    {/* 向组件中传递城市的名字 */}
                    <SearchHeader cityName={label} className={styles.searchHeader}></SearchHeader>
                </Flex>

                {/* 条件筛选栏组件 */}
                <Filter></Filter>
                
            </div>
        )
    }
}