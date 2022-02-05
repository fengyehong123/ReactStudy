import React from 'react'
import { Flex, Toast } from 'antd-mobile';
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'
// 获取当前定位城市的方法
import { getCurrentCity } from '../../utils/index'
// 导入长列表渲染的相关组件
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized';

// 导入我们自定义的导航栏组件
import SearchHeader from '../../components/SearchHeader'
// 导入条件筛选栏组件
import Filter from './components/Filter'
// 导入房源展示组件
import HouseItem from '../../components/HouseItem'
// 导入房源不存在时,展示的组件
import NoHouse from '../../components/NoHouse'
// 导入让组件吸顶功能的组件
import Sticky from '../../components/Sticky'

// 导入当前组件的样式
import styles from './index.module.css'

/*
    1. 将从子组件Filter中获取到的筛选条件数据 filters 传递给父组件HouseList
    2. HouseList组件中,创建方法onFilter,通过参数接收filters数据,并存储到this中
    3. 创建方法searchHouseList(用来获取房屋列表数据)
    4. 根据接口,获取当前定位城市id参数
    5. 将筛选条件数据与分页数据合并之后,作为接口的参数,发送请求,获取房屋数据
*/
/*
    切换城市显示房源,不生效bug
    原因: 在组件外部的代码只会在项目加载时,执行一次.在切换路由时,不会重新执行
        例如: const { label, value } = JSON.parse(localStorage.getItem('hkzf_city')); 这行代码如果写在
        HouseList类外面的话,就只会在项目加载的时候,执行一次.
        组件内部的 componentDidMount() 会在组件展示时执行,进入页面一次,执行一次.
    1. 注释掉获取当前定位城市信息的代码
    2. 导入utils中的getCurrentCity()方法
    3. 在componentDidMount()中调用getCurrentCity()方法来获取当前定位城市的信息
    4. 将label和value保存到this中
    5. 用到label和value的地方,使用this.label或者this.value来访问
*/
export default class HouseList extends React.Component {

    state = {
        // 查询到的具体的房源的数据
        list: [],
        // 房源数据的总条数
        count: 0,
        // 数据是否正在加载中
        isLoading: false,
    }

    // 给城市的id和名称赋予初始值
    label = '';
    value = '';

    // 初始化房屋过滤筛选属性(为了防止searchHouseList中的...对象展开报错)
    filters = {};

    // 进入页面就执行的钩子函数
    async componentDidMount() {

        // 调用utils中的获取当前定位城市的方法,获取出城市id和城市value
        const { label, value } = await getCurrentCity();

        // 将当前城市的id和value放到类的this中,确保其他方法可以调用
        this.label = label;
        this.value = value;

        // 一进入页面就查找房源
        this.searchHouseList();
    }

    // 接收Filter组件中的筛选条件数据
    onFilter = (filters) => {

        // 每一次过滤查询房源之后,保持页面数据在顶部
        window.scrollTo(0, 0);

        // 将筛选条件放到this中,这样在其他方法中也可以获取到filters了
        this.filters = filters;
        // 调用获取房源数据的方法
        this.searchHouseList();
    }

    // 根据筛选条件,获取房屋列表数据
    async searchHouseList() {

        // 在加载数据之前,修改组件状态为数据加载中
        this.setState(() => {
            return {
                isLoading: true,
            }
        })

        // 开启loading
        Toast.loading('加载中...', 0, null, false);

        const res = await API.get(`/houses`, {
            params: {
                // 城市ID参数
                cityId: this.value,
                // 房源过滤条件参数,使用ES6的展开运算符,将筛选条件展开到查询参数中
                ...this.filters,
                // 房源数据分页查询
                start: 1,
                end: 20
            }
        });
        const { list, count } = res.data.body;

        // 从后台获取数据之后,关闭loading
        Toast.hide();

        // 只有当有房源的时候,才会提示房源数量
        if (count !== 0) {
            Toast.info(`共找到${count}套房源`, 2, null, false)
        }
        
        // 将后端获取到的数据保存到该组件的状态中
        this.setState(() => {
            return {
                // 查询到的房源具体数据
                list,
                // 房源的总数量
                count,
                // 数据加载完成之后,将加载状态改为false
                isLoading: false
            }
        })
    }

    // 渲染房源列表
    renderHouseList = ({
        // 每条数据唯一的key值
        key,
        // 每一个列表项的索引号
        index,
        // 注意:重点属性,一定要给每一行数据添加该样式! 作用:指定每一行的位置
        style,
    }) => {

        // 从组件的状态中获取出房源列表数据
        const { list } = this.state;
        // 根据索引号来获取当前这一行的房屋数据
        const house = list[index];

        // 判断house是否存在,当不存的时候,展示loading效果占位,否则就渲染HouseItem组件
        if (!house) {
            return (
                <div key={key} style={style}>
                    <p className={styles.loading}></p>
                </div>
            )
        }

        return (
            <HouseItem 
                key={key}
                // 需要将样式传递给自定义组件,自定义组件中还是使用,否则会丢失样式
                style={style}
                src={BASE_URL + house.houseImg}
                title={house.title}
                desc={house.desc}
                tags={house.tags}
                price={house.price}
            />
        );
    }

    // 判断列表中的每一行是否加载完成
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index];
    }

    /*
        用来获取更多房屋列表数据
        注意: 该方法的返回值是一个Promise对象.并且,这个对象应该在数据加载完成时,来调用resolve让
        Promise对象的状态变为已经完成.
    */ 
    loadMoreRows = ({ startIndex, stopIndex }) => {
        /*
            加载更多房屋列表数据
            1. 在loadMoreRows方法中,根据起始索引和结束索引,发送请求,获取更多的房屋数据
            2. 在获取到最新的数据后,与当前list中的数据合并,再更新state,并调用Promise的resolve()
            3. 在renderHouseList方法中,判断house是否存在
            4. 不存在的时候,就渲染一个loading元素(防止拿不到数据的时候报错)
            5. 存在的时候,就再渲染HouseItem组件.
        */
        return new Promise(async (resolve) => {

            // 发送请求,进一步获取房源数据
            const res = await API.get(`/houses`, {
                params: {
                    // 城市ID参数
                    cityId: this.value,
                    // 房源过滤条件参数,使用ES6的展开运算符,将筛选条件展开到查询参数中
                    ...this.filters,
                    // 房源数据分页查询
                    start: startIndex,
                    end: stopIndex
                }
            });

            // 更新当前组件的数据状态
            this.setState(() => {
                return {
                    // 将当前组件的房源数据和从后端获取到的数据进行合并
                    list: [...this.state.list, ...res.data.body.list]
                }
            })

            // 数据加载完成时,调用resolve即可
            resolve();
        })
    }

    // 渲染房源列表
    renderList = () => {

        // 房屋列表的总数量
        const { count: houseListCount, isLoading } = this.state;
        // 当房源数据不存在,并且数据正在加载中的时候,使用NoHouse组件进行展示
        if (houseListCount === 0 && !isLoading) {
            return <NoHouse>没有找到房源,请您换个搜索条件吧~</NoHouse>
        }

        return (
            /*
                需求:
                    默认只加载20条数据,当20条数据加载完毕之后,需要加载更多的数据
                    因此滚动房屋的时候,需要动态加载更多的数据
                解决方式:
                    使用InfiniteLoader组件来实现无限滚动列表,从而加载更多房屋的数据
            */
            <InfiniteLoader
                // 表示每一行数据是否加载完成
                isRowLoaded={this.isRowLoaded}
                // 加载更多数据的方法,在需要加载更多数据时,会调用该方法
                loadMoreRows={this.loadMoreRows}
                // 列表数据的总条数
                rowCount={houseListCount}
            >
                {({ onRowsRendered, registerChild }) => (
                    /*
                        使用WindowScroller跟随页面滚动
                        1. 默认情况下,List组件只让组件自身出现滚动条,无法让整个页面滚动,也就无法实现标题栏吸顶功能
                        2. 解决方式: 使用WindowScroller高阶组件,让List组件跟随页面滚动(为List组件提供状态,同时还需要设置
                            List组件的autoHeight属性)
                    */
                    <WindowScroller>
                        {({height, isScrolling, scrollTop}) => (
                            <AutoSizer>
                                {({ width }) => (
                                    // 使用react-virtualized中的List组件渲染房屋列表
                                    <List
                                        onRowsRendered={onRowsRendered}
                                        ref={registerChild}
                                        // 设置高度为WindowScroller最终渲染的列表高度
                                        autoHeight
                                        // 视口的宽度
                                        width={width}
                                        // 视口的高度
                                        height={height}
                                        // 房源的总数量
                                        rowCount={houseListCount}
                                        // 每条房源列表的高度为120px
                                        rowHeight={120}
                                        // 渲染房源列表中的每一行
                                        rowRenderer={this.renderHouseList}
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>
        )
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
                    <SearchHeader cityName={this.label} className={styles.searchHeader}></SearchHeader>
                </Flex>

                {/* 
                    通过Sticky组件包裹Filter组件,让Filter组件拥有吸顶功能
                    height={40}: 表示包裹组件的固有高度
                */}
                <Sticky height={40}>
                    {/* 条件筛选栏组件,作为Sticky组件的子节点传递到Sticky组件内部 */}
                    <Filter onFilter={this.onFilter}></Filter>
                </Sticky>
                
                {/* 房屋列表 */}
                <div className={styles.houseItems}>
                    {/* 通过renderList()方法渲染列表 */}
                    {this.renderList()}
                </div>
            </div>
        )
    }
}