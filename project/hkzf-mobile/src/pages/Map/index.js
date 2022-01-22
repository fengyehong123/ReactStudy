import React from 'react'
// 导入封装好的NavHeader组件
import NavHeader from '../../components/NavHeader'
// 导入样式
import './index.scss'

export default class Map extends React.Component {

    // 钩子函数
    componentDidMount() {
        /*
            因为百度地图加载需要用到容器container
            而容器必须在DOM加载完成之后才能获取到,
            因此我们在声明周期的钩子函数中,初始化百度地图实例
            ❗在react脚手架中全局对象需要使用window来访问,否则会造成ESLint校验错误
        */
        // 创建百度地图实例
        const map = new window.BMap.Map('container');
        // 设置中心点坐标
        const point = new window.BMap.Point(116.404, 39.915);

        // 初始化地图,同时设置展示级别
        map.centerAndZoom(point, 15);
    }

    /*
        1. 封装NavHeader组件实现城市选择,地图找房页面的复用
        2. 在components目录中创建组件NavHeader/index.js
        3. 在该组件中封装antd-mobile组件库中的NavBar组件
        4. 在地图找房页面中使用封装好的NavHeader组件实现顶部导航栏功能
        5. 使用NavHeader组件,替换城市选择页面的NavBar组件
    */
    render() {
        return (
            <div className="map">
                {/* 顶部导航栏组件 */}
                <NavHeader>
                    {/* 通过组件子节点的方式传递参数 */}
                    地图找房
                </NavHeader>
                {/* 百度地图的容器 */}
                <div id="container"></div>
            </div>
        )
    }
}