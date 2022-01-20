import React from 'react';
import axios from 'axios';
import { NavBar } from 'antd-mobile';

// 导入长列表渲染的组件
import { List, AutoSizer } from 'react-virtualized';

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

// 索引(A,B等)的高度
const TITLE_HEIGHT = 36;
// 每个城市名称的高度
const NAME_HEIGHT = 50;

/*
    封装处理字母索引的方法
*/
const formatCityIndex = (letter) => {

    switch (letter) {

        case '#':
            return '当前定位';
        case 'hot':
            return '热门城市';
        default:
            // 将小写字母的索引转换为大写字母
            return letter.toUpperCase();
    }
}

export default class CityList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            /*
                城市列表数据
                {
                    a: [{}, {}],
                    b: [{}, {}, {}, ...]
                }
            */
            cityList: {},
            // 城市列表索引数据
            cityIndex: []
        }
    }

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

        // 将组装好的城市列表数据放到组件的状态数据中
        this.setState(() => {
            return {
                cityList: cityList,
                cityIndex: cityIndex
            }
        })
    }

    /*
        将rowRenderer函数,改为箭头函数形式,解决函数内部this的指向问题(我们需要通过this来获取组件的state)
        List组件渲染每一行数据的渲染函数
        函数的返回值就表示最终渲染在页面中的内容
    */
    rowRenderer = ({
        // 每条数据唯一的key值
        key,
        // 每一个列表项的索引号
        index,
        // 当前项是否正在滚动中(正在滚动该值为true,否则为false)
        isScrolling,
        // 当前项在List中是可见的
        isVisible,
        // 注意:重点属性,一定要给每一行数据添加该样式! 作用:指定每一行的位置
        style,
    }) => {

        /*
            获取每一行的字母索引列表和城市数据对象
            将rowRenderer函数修改为箭头函数(获取进行this绑定)的形式才能获取到state
        */ 
        const { cityIndex, cityList } = this.state;
        // 根据列表的索引号获取城市index
        const letter = cityIndex[index];

        // 获取指定字母索引下的城市列表数据
        console.log(cityList[letter]);

        return (
            <div key={key} style={style} className="city">
                <div className="title">{formatCityIndex(letter)}</div>
                {
                    // 通过城市索引获取索引所对应的城市list,并进行遍历渲染
                    cityList[letter].map(item => <div className="name" key={item.value}>{item.label}</div>)
                }
            </div>
        );
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

                {/* 使用AutoSizer组件解决自动获取页面宽度和高度的问题 */}
                <AutoSizer>
                    {
                        /*  
                            通过render-props模式获取到AutoSizer组件暴露的width和height属性
                            城市列表组件
                        */ 
                        ({width, height}) => <List
                            width={width}
                            height={height}
                            // 获取组件中城市索引的长度
                            rowCount={this.state.cityIndex.length}
                            // 指定每一行的高度
                            rowHeight={100}
                            // 指定城市列表的渲染函数
                            rowRenderer={this.rowRenderer}
                        />
                    }
                </AutoSizer>
            </div>
        )
    }
}