import React from 'react'
import { Link } from 'react-router-dom'
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

    constructor(props) {
        super(props);
        this.state = {
            // 小区下的房源列表
            housesList: [],
            // 表示是否展示房源列表
            isShowList: false
        };
    }

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
            this.createOverlays(item, nextZoom, type);
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
    createOverlays(data, zoom, type) {

        // 从房源数据中解构出需要用到的信息
        const { 
            // 房源经纬度
            coord: { longitude, latitude },
            // 区域名称
            label: areaName, 
            // 房源数量
            count,
            // 房源数据的唯一id标识
            value
        }  = data;

        // 覆盖物的坐标对象
        const areaPoint = new BMap.Point(longitude, latitude);

        if (type === 'circle') {
            // 创建区或者镇的覆盖物
            this.createCircle(areaPoint, areaName, count, value, zoom);
        } else {
            // 创建小区的覆盖物
            this.createRect(areaPoint, areaName, count, value);
        }
    }

    /*
        创建区,镇覆盖物
    */
    createCircle(areaPoint, areaName, count, id, zoom) {
        /*
            1. 创建Label实例对象.
            2. 调用Label的setContent()方法,传入HTML结构,修改HTML内容的样式
            3. 调用setStyle()方法设置样式.
            4. 给文本覆盖物添加单击事件
            4. 在map对象上调用addOverlay()方法,将文本覆盖物添加到地图中.
        */
        // 实例对象的配置项
        const opts = {
            // 房源数据在画面上的位置(根据房源的经纬度,通过百度地图的API创建)
            position: areaPoint,
            // 画面上的位置偏移量,调整覆盖物在画面上的位置
            offset: new BMap.Size(-35, -35)
        }

        /*
            创建Label实例对象
            label设置setContent后,第一个参数中设置的文本内容就失效了,因此直接清空即可
        */ 
        const label = new BMap.Label('', opts);

        // 给Label添加一个唯一标识
        label.id = id;

        /*
            设置房源覆盖物的内容(通过在Label中自定义HTML,创建覆盖物)
            我们在普通的html中也是用了css module,css module可以使用在任何css中
        */ 
        label.setContent(`
            <div class="${styles.bubble}">
                <p class="${styles.name}">${areaName}</p>
                <p>${count}套</p>
            </div>
        `)

        // 设置覆盖物的样式(labelStyle是我们自定义的覆盖物的样式)
        label.setStyle(labelStyle);

        /*
            给地图上的覆盖物添加单击事件,保证单击覆盖物之后,能放大页面,
            在新的页面中重新获取房源数据进行渲染
        */ 
        label.addEventListener('click', () => {

            // 调用renderOverlays方法,获取该区域下面的房源数据
            this.renderOverlays(id);
            
            // 以当前被点击的覆盖物为中心,根据缩放级别来放大地图
            this.map.centerAndZoom(areaPoint, zoom);

            // 解决清除覆盖物时,百度地图API的JS文件自身报错的问题
            setTimeout(() => {
                // 放大完成之后,清除覆盖物信息
                this.map.clearOverlays();
            }, 0);
        })

        // 添加覆盖物到地图中(overlay是覆盖物的意思)
        this.map.addOverlay(label);
    }

    /*
        创建小区覆盖物
    */
    createRect(areaPoint, areaName, count, id) {
        
        /*
            创建Label实例对象
            label设置setContent后,第一个参数中设置的文本内容就失效了,因此直接清空即可
        */ 
        const label = new BMap.Label('', {
            // 房源数据在画面上的位置(根据房源的经纬度,通过百度地图的API创建)
            position: areaPoint,
            // 画面上的位置偏移量,调整覆盖物在画面上的位置
            offset: new BMap.Size(-50, -28)
        });

        // 给Label添加一个唯一标识
        label.id = id;

        /*
            设置房源覆盖物的内容(通过在Label中自定义HTML,创建覆盖物)
            我们在普通的html中也是用了css module,css module可以使用在任何css中
        */ 
        label.setContent(`
            <div class="${styles.rect}">
                <span class="${styles.housename}">${areaName}</span>
                <span class="${styles.housenum}">${count}套</span>
                <i class="${styles.arrow}"></i>
            </div>
        `)

        // 设置覆盖物的样式(labelStyle是我们自定义的覆盖物的样式)
        label.setStyle(labelStyle);

        /*
            给地图上的覆盖物添加单击事件,保证单击覆盖物之后,能放大页面,
            在新的页面中重新获取房源数据进行渲染
        */ 
        label.addEventListener('click', () => {

            /*
                1. 在单击事件中获取到小区的房源数据
                2. 展示房源列表
                3. 渲染获取到的房源列表
                4. 调用地图的panBy()方法,移动地图到中间位置
                    公式:
                        垂直位移：(window.innerHeight - 330) / 2 - target.clientY
                        水平平移：window.innerWidth / 2 - target.clientX
                5. 监听地图的movestart事件,在地图移动的时候隐藏房源列表
            */
            // 获取房源数据
            this.getHousesList(id);
        })

        // 添加覆盖物到地图中(overlay是覆盖物的意思)
        this.map.addOverlay(label);
    }

    // 获取小区的房源数据
    async getHousesList(id) {
        // 获取房源数据
        const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`);

        this.setState(() => {
            return {
                // 解构出的具体房屋数据
                housesList: res.data.body.list,
                // 是否展示房源列表
                isShowList: true
            }
        });
    }

    // 封装渲染房屋列表的方法
    renderHousesList() {

        return (
            // 遍历房源数据,进行渲染
            this.state.housesList.map(item => (
                <div className={styles.house} key={item.houseCode}>
                    {/* 房源的图片 */}
                    <div className={styles.imgWrap}>
                        <img className={styles.img} src={`http://localhost:8080${item.houseImg}`} alt="" />
                    </div>
                    {/* 房源的内容 */}
                    <div className={styles.content}>
                        <h3 className={styles.title}>{item.title}</h3>
                        <div className={styles.desc}>{item.desc}</div>
                        {/* 房源特性的标签 */}
                        <div>
                            {/* 一个房源可能会有多个标签,我们遍历渲染 */}
                            {item.tags.map((tag, index) => {
                                const tagClass = 'tag' + (index + 1);
                                return (
                                    // 渲染不同标签所拥有的样式
                                    <span className={[styles.tag, styles[tagClass]].join(' ')} key={tag} >
                                        {tag}
                                    </span>
                                )
                            })}
                        </div>
                        {/* 房源的价格 */}
                        <div className={styles.price}>
                            <span className={styles.priceNum}>{item.price}</span> 元/月
                        </div>
                    </div>
                </div>
            ))
        )
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

                {/* 
                    房源列表
                    当添加添加 styles.show 的时候,房屋列表才会被展示
                */}
                <div className={[styles.houseList, this.state.isShowList ? styles.show : ''].join(' ')}>
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <Link className={styles.titleMore} to="/home/list">
                            更多房源
                        </Link>
                    </div>

                    <div className={styles.houseItems}>
                        {/* 房屋结构 */}
                        {this.renderHousesList()}
                    </div>
                </div>
            </div>
        )
    }
}