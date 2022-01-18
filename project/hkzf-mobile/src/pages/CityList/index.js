import React from 'react';
import axios from 'axios';
import { NavBar } from 'antd-mobile';

// 导入utils中获取当前定位城市的方法
import {getCurrentCity} from '../../utils'

import './index.scss'

/*
    格式化城市列表数据
    list: [
        {label: '北京', value: 'AREA|88cff55c-aaa4-e2e0', pinyin: 'beijing', short: 'bj'}, 
        {label: '安庆', value: 'AREA|b4e8be1a-2de2-e039', pinyin: 'anqing', short: 'aq'}
    ]
*/ 
const formatCityData = (list) => {

    /*
        城市列表数据cityList
        {
            a: [{}, {}],
            b: [{}, {}, {}, ...]
        }
    */
    const cityList = {};

    /*
        1. 遍历list数组
        2. 获取每一个城市的首字母
        3. 判断cityList中是否有该分类
        4. 如果有,就直接往该分类中push数据
        5. 如果没有,就先创建一个数组,然后把当前城市信息添加到数组中
    */
    for(const [, item] of list.entries()) {

        // 获取城市的首字母
        const first = item.short.substr(0, 1);

        // 判断城市列表中是否有该城市
        if (cityList[first]) {
            // 如果有该城市,就直接添加
            cityList[first].push(item);
        } else {
            // 如果没有该城市,就创建数组,然后把城市信息添加到数组中
            cityList[first] = [item];
        }
    }

    /*
        根据城市列表数据cityList,获取城市索引数据
        Object.keys(): 可以获取对象中的所有的key
    */
    const cityIndex = Object.keys(cityList).sort();

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

        // ⏹ 通过解构得到城市列表和城市索引数据
        const {cityList, cityIndex} = formatCityData(res.data.body);

        /*
            ⏹ 获取热门城市数据
            将数据添加到cityList中,将索引添加到cityIndex中
        */
        const hotRes = await axios.get('http://localhost:8080/area/hot');

        // 添加热门城市数据到城市列表中
        cityList['hot'] = hotRes.data.body;
        // 使用unshift方法来添加hot索引到数组的开头(需要保证顺序)
        cityIndex.unshift('hot');

        // ⏹ 获取当前定位城市(使用工具类中封装好的方法)
        const curCity = await getCurrentCity();
       
        // 将当前定位城市添加到cityList中
        cityList['#'] = [curCity];
        // 将当前定位城市的索引添加到cityIndex中
        cityIndex.unshift('#');
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