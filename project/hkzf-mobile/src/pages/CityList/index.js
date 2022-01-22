import React from 'react';
import axios from 'axios';
import { Toast } from 'antd-mobile';

// 导入长列表渲染的组件
import { List, AutoSizer } from 'react-virtualized';

// 导入utils中获取当前定位城市的方法
import {getCurrentCity} from '../../utils'

// 导入封装好的NavHeader组件
import NavHeader from '../../components/NavHeader'

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
// 当前有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳'];

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
            cityIndex: [],
            // 指定右侧字母索引列表高亮的索引号
            activeIndex: 0
        }

        /*
            因为在第三方组件中使用当前用组件中的state,
            所以需要修改第三方组件中this指向为当前组件中的this
        */ 
        this.setCustomRowHeight = this.setCustomRowHeight.bind(this);
        this.onRowsRendered = this.onRowsRendered.bind(this);

        // 创建ref对象
        this.cityListComponent = React.createRef();
    }

    // 一进入页面,就获取数据
    async componentDidMount() {

        // 获取城市数据,调用时添加 await 保证getCityList方法执行完了才执行measureAllRows方法
        await this.getCityList();

        /*
            调用measureAllRows,提前计算List组件中每一行的高度,实现 scrollToRow 的精确跳转
            ❗❗注意:调用该方法的时候,需要保证List组件中已经有数据了,如果List组件中的数据为空,就会导致调用该方法时报错
            解决: 只要保证该方法时在获取到数据之后调用的即可.因为this.getCityList()方法时异步执行的,我们只要给该方法添加await即可
        */ 
        // 通过ref对象获取到List组件对象
        const componentObj = this.cityListComponent.current;
        componentObj.measureAllRows();
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
        1. 给城市列表绑定点击事件.
        2. 判断当前城市是否有房源数据(目前只有北上广深四个城市有数据)      
        3. 如果有房源数据,则保存当前城市数据到本地缓存中,并返回上一页.
        4. 如果没有房源数据,则提示用户: 该城市暂无房源数,不执行任何操作
    */
    changeCity(currentCity) {

        // 从当前城市中解构出所需要的信息
        const {label, value} = currentCity;

        // 如果当前点击的城市在有房源的城市列表中的话
        if (HOUSE_CITY.includes(label)) {

            // 将当前有房源的城市放到本地缓存中
            localStorage.setItem('hkzf_city', JSON.stringify({label, value}));

            // 路由返回上一页面
            this.props.history.go(-1);
        } else {
            
            // 当前城市无房源数据的话,调用Toast轻提示组件,展示提示信息
            Toast.info('该城市暂无房源数', 1, null, false);
        }
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

        return (
            <div key={key} style={style} className="city">
                <div className="title">{formatCityIndex(letter)}</div>
                {
                    // 通过城市索引获取索引所对应的城市list,并进行遍历渲染
                    cityList[letter].map(item =>
                        // 给每一个城市元素绑定点击事件,点击之后切换当前所在城市
                        <div className="name" key={item.value} onClick={() => this.changeCity(item)}>
                            {item.label}
                        </div>    
                    )
                }
            </div>
        );
    }

    // 设置List中的行高度
    setCustomRowHeight({index}) {
        /*
            索引标题高度 + 城市数量 * 城市名称的高度
            TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
        */
        // 从组件中获取城市索引和城市list
        const { cityIndex, cityList } = this.state;
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
    }

    /*
        1. 给索引列表绑定点击事件
        2. 在点击事件中,通过index获取到当前项的索引号
        3. 调用List组件的 scrollToRow 方法,让List组件滚动到指定行
            3.1 在constructor中,调用React.createRef()创建ref对象
            3.2 将创建好的ref对象,添加为List组件的ref属性.
            3.3 通过ref的current属性,获取到组件的实例,再调用组件的scrollToRow方法
            3.4 scrollToRow方法要求List中的各个项目在页面中是可见的,如果不可见,跳转时会出现精度丢失的问题
        4. 设置List组件的scrollToAlignment配置项为start,保证被点击行出现在页面顶部
        5. 对于点击索引无法正确定位的问题,调用List组件的 measureAllRows 方法,提前计算高度来解决
    */
    // 封装渲染右侧索引列表的方法
    renderCityIndex() {

        // 解构出城市索引和当前活动高亮的索引号
        const { cityIndex, activeIndex } = this.state;

        // 获取到cityIndex数据,遍历之后,进行渲染
        return cityIndex.map((item, index) =>
            // 进行遍历生成DOM元素的时候,需要添加一个key
            <li className="city-index-item" key={item} onClick={() => {

                /*
                    通过this.cityListComponent获取到ref对象,
                    通过ref对象中的current属性获取到组件的实例(cityListComponent这个ref对象已经和List组件关联)
                */ 
                const componentObj = this.cityListComponent.current;
                // 指定要跳转的索引号
                componentObj.scrollToRow(index);
            }}>
                {/* 当前列表中元素的index和活动高亮index相同的haul,给索引设置高亮效果 */}
                <span className={activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
            </li>
        );
    }

    /*
        1. 给List组件添加onRowsRendered配置项,用于获取当前列表渲染的行信息
        2. 通过参数 startIndex 获取到起始行索引(也就是城市列表可视区域最顶部一行的索引号)
        3. 判断 startIndex 和activeIndex是否相同(判断的目的是为了提升性能,避免不必要的state更新)
        4. 当startIndex和activeIndex不相同时,更新状态activeIndex为startIndex的值
    */
    // 用于获取List组件中渲染行的信息
    onRowsRendered({ startIndex }) {
        
        // startIndex 和activeIndex不相同时,修改活动索引
        if (this.state.activeIndex !== startIndex ) {
            this.setState(() => {
                return {
                    activeIndex: startIndex
                }
            })
        }
    }

    render() {
        return (
            <div className="cityList">

                {/* 使用自己封装好的导航栏组件 */}
                <NavHeader>
                    城市选择
                </NavHeader>

                {/* 使用AutoSizer组件解决自动获取页面宽度和高度的问题 */}
                <AutoSizer>
                    {
                        /*  
                            通过render-props模式获取到AutoSizer组件暴露的width和height属性
                            城市列表组件
                        */ 
                        ({width, height}) => 
                        <List
                            // 指定组件的实例对象,将List组件和我们创建的ref对象关联到一起
                            ref={this.cityListComponent}
                            width={width}
                            height={height}
                            // 获取组件中城市索引的长度
                            rowCount={this.state.cityIndex.length}
                            /*
                                指定每一行的高度:高度可以是一个数字,固定高度
                                也可以是一个函数,用来动态的计算高度
                                当高度指定为函数的时候,函数的参数是List中行的索引号
                            */ 
                            rowHeight={this.setCustomRowHeight}
                            // 指定城市列表的渲染函数
                            rowRenderer={this.rowRenderer}
                            // 用于获取List组件中渲染行的信息
                            onRowsRendered={this.onRowsRendered}
                            scrollToAlignment="start"
                        />
                    }
                </AutoSizer>

                {/* 右侧的索引列表 */}
                {/* 
                    1. 封装renderCityIndex方法,用来渲染城市索引列表
                    2. 在方法中,获取到索引数组cityIndex,遍历cityIndex,渲染索引列表
                    3. 将索引hot替换为热
                    4. 在state中添加activeIndex,指定当前高亮的索引
                    5. 在遍历cityIndex时,添加当前字母索引是否高亮的判断条件
                */}
                <ul className="city-index">
                    {/* 调用渲染索引列表的函数 */}
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}