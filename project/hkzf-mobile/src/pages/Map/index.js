import React from 'react'
// 导入axios
import axios from 'axios'
// 导入封装好的NavHeader组件
import NavHeader from '../../components/NavHeader'
// 导入样式(CSS Module)
import styles from './index.module.css'

// 解决脚手架中全局变量访问的问题
const BMap = window.BMap;

// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

export default class Map extends React.Component {

    // 钩子函数
    componentDidMount() {

        // 一进入页面就初始化地图
        this.initMap();
    }

    // 初始化地图
    initMap() {
        /*
            1. 从本地缓存中获取当前定位城市的名称和唯一标识符
            2. 使用地址解析器解析当前城市坐标
            3. 调用centerAndZoom()方法在地图中展示当前城市,并设置缩放级别为11.
            4. 在地图中展示该城市,并添加比例尺和平移缩放控件
        */
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'));
    

        /*
            因为百度地图加载需要用到容器container
            而容器必须在DOM加载完成之后才能获取到,
            因此我们在声明周期的钩子函数中,初始化百度地图实例
            ❗在react脚手架中全局对象需要使用window来访问,否则会造成ESLint校验错误
            我们将window.BMap制作为全局变量
        */
        // 创建百度地图实例
        const map = new BMap.Map('container');
        // 地图实例对象放到this中,方便在其他方法中通过this获取到地图对象
        this.map = map;
        
        // 创建地址解析器实例(该解析器可以根据传入的地址名称解析出名称所对应的经纬度)
        const myGeo = new BMap.Geocoder();

        // 将汉字的地址名的解析结果显示在地图上,并调整地图的视野
        myGeo.getPoint(label, (point) => {

            // point为解析出的经纬度
            if (!point) {
                return;
            }
            
            // 初始化地图,同时设置展示级别
            map.centerAndZoom(point, 11);

            // 在地图上添加常用控件
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.ScaleControl());

            // 在地图上渲染覆盖物的入口
            this.renderOverlays(value);
            
        }, label);
    }

    /*
        渲染覆盖物入口
        1. 接收区域id参数,获取该区域下的房源数据
        2. 获取房源类型以及下级地图的缩放级别
    */
    async renderOverlays(id) {

        // 获取出房源数据
        const res = await axios.get(`http://localhost:8080/area/map?id=${id}`);
        const data = res.data.body;
        
        // 调用,获取缩放级别和类型
        const { nextZoom, type } = this.getTypeAndZoom();

        // 遍历房源数据,创建覆盖物
        for (const item of data.values()) {
            // 根据房源信息,覆盖物类型,覆盖物缩放级别来创建覆盖物
            this.createOverlays(item, nextZoom, type)
        }
    }

    /*
        计算要绘制的覆盖物的类型和下一个缩放级别
        区: 11,范围: >=10 < 12
        镇: 13,范围: >=12 < 14
        小区: 15,范围: >= 14 < 16
    */
    getTypeAndZoom() {

        // 下一个缩放级别和覆盖物类型
        let nextZoom, type;

        // 通过this获取到map地图实例,然后获取到地图缩放级别
        const zoom = this.map.getZoom();

        if (zoom >= 10 && zoom < 12) {
            // 当前缩放范围是区级别的话,点击覆盖物之后,下一个缩放级别就是镇级别的
            nextZoom = 13;
            type = 'circle';
        } else if (zoom >= 12 && zoom < 14) {
            // 当前缩放范围是镇级别的话,点击覆盖物之后,下一个缩放级别就是小区级别的
            nextZoom = 15;
            type = 'circle'
        } else if (zoom >= 14 && zoom < 16) {
            // 当前缩放级别是小区的话,就无法再缩放了,因此不需要缩放级别了.只需要设置覆盖物类型为长方形
            type = 'rect';
        }

        // 将当前缩放级别和覆盖物类型返回
        return {
            nextZoom,
            type
        }
    }

    /*
        创建覆盖物
    */
    createOverlays() {

    }

    /*
        创建小区覆盖物
    */
    createRect() {

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