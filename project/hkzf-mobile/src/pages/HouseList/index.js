import React from 'react'

// 导入我们自定义的导航栏组件
import SearchHeader from '../../components/SearchHeader'

// 获取当前定位城市的信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'));

export default class HouseList extends React.Component {
    
    render() {
        return (
            <div>
                {/* 向组件中传递城市的名字 */}
                <SearchHeader cityName={label}></SearchHeader>
            </div>
        )
    }
}