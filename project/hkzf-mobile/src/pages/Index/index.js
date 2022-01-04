import React from 'react'
// 导入轮播图组件
import { Carousel } from 'antd-mobile';
// 导入axios
import axios from 'axios'

export default class Index extends React.Component {
    
    state = {
        // 轮播图状态数据
        swipers: []
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
                swipers: res.data.body
            }
        })
    }

    // 渲染轮播图解耦
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

    render() {
        return (
            <div className="index">
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
                </Carousel>
            </div>
        );
    }
}