import React from 'react'
import { NavBar } from 'antd-mobile';

import './index.scss'

export default class CityList extends React.Component {
    render() {
        return (
            <div className="cityList">
                <NavBar
                    className="navbar"
                    mode="light"
                    icon={<i className="iconfont icon-back"/>}
                    // 点击左侧的图标按钮,返回上一个页面
                    onLeftClick={() => this.props.history.go(-1)}
                >
                    城市选择
                </NavBar>
            </div>
        )
    }
}