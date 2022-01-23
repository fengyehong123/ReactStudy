import React from 'react'
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
            if (!point) {
                return;
            }
            
            // 初始化地图,同时设置展示级别
            map.centerAndZoom(point, 11);

            // 在地图上添加常用控件
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.ScaleControl());

            /*
                1. 创建Label实例对象.
                2. 调用Label的setContent()方法,传入HTML结构,修改HTML内容的样式
                3. 调用setStyle()方法设置样式.
                4. 给文本覆盖物添加单击事件
                4. 在map对象上调用addOverlay()方法,将文本覆盖物添加到地图中.
            */
            // 实例对象的配置项
            const opts = {
                // 画面上的位置
                position: point,
                // 画面上的位置偏移量,调整覆盖物在画面上的位置
                offset: new BMap.Size(-35, -35)
            }

            /*
                创建Label实例对象
                label设置setContent后,第一个参数中设置的文本内容就失效了,因此直接清空即可
            */ 
            const label = new BMap.Label('', opts);

            /*
                设置房源覆盖物的内容(通过在Label中自定义HTML,创建覆盖物)
                我们在普通的html中也是用了css module,css module可以使用在任何css中
            */ 
            label.setContent(`
                <div class="${styles.bubble}">
                    <p class="${styles.name}">浦东</p>
                    <p>99套</p>
                </div>
            `)

            // 设置覆盖物的样式(labelStyle是我们自定义的覆盖物的样式)
            label.setStyle(labelStyle);

            // 给地图上的覆盖物添加单击事件,保证单击覆盖物之后,能放大页面
            label.addEventListener('click', () => {
                console.log('房源覆盖物被点击了!');
            })

            // 添加覆盖物到地图中(overlay是覆盖物的意思)
            map.addOverlay(label);

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