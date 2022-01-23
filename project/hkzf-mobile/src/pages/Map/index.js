import React from 'react'
// 导入封装好的NavHeader组件
import NavHeader from '../../components/NavHeader'
// 导入样式(CSS Module)
import styles from './index.module.css'

// 解决脚手架中全局变量访问的问题
const BMap = window.BMap;

export default class Map extends React.Component {

    // 钩子函数
    componentDidMount() {

        // 一进入页面就初始化地图
        this.initMap();
    }

    // 初始化地图
    initMap() {
        /*
            1. 从本地缓存中获取当前定位城市
            2. 使用地址解析器解析当前城市坐标
            3. 调用centerAndZoom()方法在地图中展示当前城市,并设置缩放级别为11.
            4. 在地图中展示该城市,并添加比例尺和平移缩放控件
        */
        const { label } = JSON.parse(localStorage.getItem('hkzf_city'));
    

        /*
            因为百度地图加载需要用到容器container
            而容器必须在DOM加载完成之后才能获取到,
            因此我们在声明周期的钩子函数中,初始化百度地图实例
            ❗在react脚手架中全局对象需要使用window来访问,否则会造成ESLint校验错误
            我们将window.BMap制作为全局变量
        */
        // 创建百度地图实例
        const map = new BMap.Map('container');
        
        // 创建地址解析器实例(该解析器可以根据传入的地址名称解析出名称所对应的经纬度)
        const myGeo = new BMap.Geocoder();

        // 将汉字的地址名的解析结果显示在地图上,并调整地图的视野
        myGeo.getPoint(label, function(point) {

            // point为解析出的经纬度
            if (point) {
                // 初始化地图,同时设置展示级别
                map.centerAndZoom(point, 11);

                // 在地图上添加常用控件
                map.addControl(new BMap.NavigationControl());
                map.addControl(new BMap.ScaleControl());
            }
        }, label);
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
            <div className={styles.map}>
                {/* 顶部导航栏组件 */}
                <NavHeader>
                    {/* 通过组件子节点的方式传递参数 */}
                    地图找房
                </NavHeader>
                {/* 百度地图的容器 */}
                <div id="container" className={styles.container}></div>
            </div>
        )
    }
}