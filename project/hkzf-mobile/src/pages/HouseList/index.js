import React from 'react'
import { Flex } from 'antd-mobile';
import { API } from '../../utils/api'

// 导入我们自定义的导航栏组件
import SearchHeader from '../../components/SearchHeader'
// 导入条件筛选栏组件
import Filter from './components/Filter'

// 导入当前组件的样式
import styles from './index.module.css'

// 获取当前定位城市的信息
const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'));

/*
    1. 将从子组件Filter中获取到的筛选条件数据 filters 传递给父组件HouseList
    2. HouseList组件中,创建方法onFilter,通过参数接收filters数据,并存储到this中
    3. 创建方法searchHouseList(用来获取房屋列表数据)
    4. 根据接口,获取当前定位城市id参数
    5. 将筛选条件数据与分页数据合并之后,作为接口的参数,发送请求,获取房屋数据
*/
export default class HouseList extends React.Component {

    state = {
        // 查询到的具体的房源的数据
        list: [],
        // 房源数据的总条数
        count: 0
    }

    // 初始化房屋过滤筛选属性(为了防止searchHouseList中的...对象展开报错)
    filters = {};

    // 进入页面就执行的钩子函数
    componentDidMount() {

        // 一进入页面就查找房源
        this.searchHouseList();
    }

    // 接收Filter组件中的筛选条件数据
    onFilter = (filters) => {
        // 将筛选条件放到this中,这样在其他方法中也可以获取到filters了
        this.filters = filters;
        // 调用获取房源数据的方法
        this.searchHouseList();
    }

    // 根据筛选条件,获取房屋列表数据
    async searchHouseList() {

        const res = await API.get(`/houses`, {
            params: {
                // 城市ID参数
                cityId: value,
                // 房源过滤条件参数,使用ES6的展开运算符,将筛选条件展开到查询参数中
                ...this.filters,
                // 房源数据分页查询
                start: 1,
                end: 20
            }
        });
        
        // 将后端获取到的数据保存到该组件的状态中
        const {list, count} = res.data.body;
        this.setState(() => {
            return {
                // 查询到的房源具体数据
                list,
                // 房源的总数量
                count 
            }
        })
    }

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
                <Filter onFilter={this.onFilter}></Filter>
            </div>
        )
    }
}