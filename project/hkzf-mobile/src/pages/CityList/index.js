import React from 'react';
import axios from 'axios';
import { NavBar } from 'antd-mobile';

import './index.scss'

/*
    格式化城市列表数据
    list: [
        {label: '北京', value: 'AREA|88cff55c-aaa4-e2e0', pinyin: 'beijing', short: 'bj'}, 
        {label: '安庆', value: 'AREA|b4e8be1a-2de2-e039', pinyin: 'anqing', short: 'aq'}
    ]
*/ 
const formatCityData = (list) => {

    // 城市列表数据
    const cityList = {};
    // 城市索引数据
    const cityIndex = [];

    /*
        1. 遍历list数组
        2. 获取每一个城市的首字母
        3. 判断cityList中是否有该分类
        4. 如果有,就直接往该分类中push数据
        5. 如果没有,就先创建一个数组,然后把当前城市信息添加到数组中
    */
    for(const [, item] of list.entries()) {
        const first = item.short.substr(0, 1);
        console.log(first);
    }

    return {
        cityList,
        cityIndex
    }
}

export default class CityList extends React.Component {

    // 一进入页面,就获取数据
    componentDidMount() {
        // 获取城市数据
        this.getCityList();
    }

    // 获取城市列表数据的方法
    async getCityList() {
        const res = await axios.get('http://localhost:8080/area/city?level=1');
        console.log(res);
        // 通过解构得到城市列表和城市索引数据
        const {cityList, cityIndex} = formatCityData(res.data.body);
        console.log(cityList, cityIndex);
    }

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