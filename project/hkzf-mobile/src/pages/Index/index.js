import React from 'react'
// 导入轮播图组件
import { Carousel, Flex } from 'antd-mobile';
// 导入axios
import axios from 'axios'
// 导入当前组件的css文件
import './index.scss'

// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导航菜单数据
const navs = [
    {
        id: 1,
        img: Nav1,
        title: '整租',
        path: '/home/list'
    },
    {
        id: 2,
        img: Nav2,
        title: '合租',
        path: '/home/list'
    },
    {
        id: 3,
        img: Nav3,
        title: '地图找房',
        path: '/map'
    },
    {
        id: 4,
        img: Nav4,
        title: '去出租',
        path: '/rent'
    }
]

export default class Index extends React.Component {
    
    state = {
        // 轮播图状态数据
        swipers: [],
        // 轮播图加载完成的flag
        isSwiperLoaded: false,
    }

    // 钩子函数,装载完成,在render之后才会被调用
    componentDidMount() {
        // 一进入页面,就调用获取轮播图数据的方法
        this.getSwipers();
    }

    // 获取轮播图数据的方法
    async getSwipers() {
        // 调用接口,获取轮播图的图片地址
        const res = await axios.get('http://localhost:8080/home/swiper');
        this.setState(() => {
            return {
                // 将轮播图的数据放到swipers列表中
                swipers: res.data.body,
                isSwiperLoaded: true,
            }
        })
    }

    // 渲染轮播图
    renderSwipers() {
        return (
            // 遍历轮播图的数据,渲染轮播图
            this.state.swipers.map(item => (
                <a
                    key={item.id}
                    href="http://www.alipay.com"
                    style={{ display: 'inline-block', width: '100%', height: 212 }}
                >
                    <img
                        src={`http://localhost:8080${item.imgSrc}`}
                        alt=""
                        style={{ width: '100%', verticalAlign: 'top' }}
                    />
                </a>
            ))
        );
    }

    // 渲染导航菜单
    renderNavs() {
        return (
            // 对导航菜单数据进行遍历
            navs.map(item => (
                // 点击导航按钮,实现路由跳转
                <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
                    <img src={item.img} alt='' />
                    <h2>{item.title}</h2>
                </Flex.Item>
            ))
        )
    }

    render() {
        return (
            <div className="index">
                {/* 
                    之所以要在轮播图的外面包裹一层div,
                    是为了解决轮播图资源还没有获取到,
                    导航菜单从顶部落到底部的一闪而过的问题
                */}
                <div className="swiper">
                    {/* 轮播图 */}
                    {
                        // 只有将轮播图加载完毕之后,才会进行渲染
                        this.state.isSwiperLoaded ?
                        <Carousel
                            // 是否自动播放
                            autoplay={true}
                            // 是否循环播放
                            infinite={true}
                            // 轮播图之间的间隔,每5秒钟播放一次
                            autoplayInterval={5000}
                        >
                            {/* 调用渲染轮播图的方法 */}
                            {this.renderSwipers()}
                        </Carousel> : ''
                    }
                </div>

                {/* 导航菜单 */}
                <Flex className="nav">
                    {/* 使用Flex布局组件 */}
                    {this.renderNavs()}
                </Flex>
            </div>
        );
    }
}