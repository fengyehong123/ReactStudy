import React from 'react'
// 导入轮播图组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
// 导入axios
import axios from 'axios'
// 导入当前组件的scss文件
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
        // 租房小组的数据
        groups: [],
        // 最新资讯
        news: []
    }

    // 钩子函数,装载完成,在render之后才会被调用
    componentDidMount() {
        // 一进入页面,就调用获取轮播图数据的方法
        this.getSwipers();
        // 一进入页面,就调用获取租房小组的方法
        this.getGroups();
        // 一进入页面,就获取最新资讯
        this.getNews();
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

    // 获取租房小组数据的方法
    async getGroups() {
        // 调用API接口,获取小组数据
        const res = await axios.get('http://localhost:8080/home/groups', {
            params: {
                area: 'AREA|88cff55c-aaa4-e2e0'
            }
        });

        // 更新数据状态
        this.setState(() => {
            return {
                // res.data.body: 后端获取到的接口数据
                groups: res.data.body
            }
        });
    }

    // 获取最新资讯
    async getNews() {
        // 发送请求,获取数据
        const urlSearchParams = new URLSearchParams([['area', 'AREA|88cff55c-aaa4-e2e0']]);
        const res = await axios.get(`http://localhost:8080/home/news?${urlSearchParams.toString()}`);

        // 更新状态
        this.setState(() => {
            return {
                news: res.data.body
            }
        });
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

    // 渲染最新资讯
    renderNews() {
        return this.state.news.map(item => (
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img className="img" src={`http://localhost:8080${item.imgSrc}`} alt="" />
                </div>
                <Flex className="content" direction="column" justify="between">
                    <h3 className="title">{item.title}</h3>
                    <Flex className="info" justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </div>
        ))
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

                {/* 租房小组 */}
                <div className="group">
                    <h3 className="group-title">
                        租房小组 <span className="more">更多</span>
                    </h3>
                    {/* 宫格组件 */}
                    <Grid
                        // 宫格的数据
                        data={this.state.groups} 
                        // 宫格的列数
                        columnNum={2}
                        // 是否为正方形
                        square={false}
                        // 是否有边框
                        hasLine={false}
                        // 自定义的宫格渲染函数
                        renderItem={(item) => (
                            // item是group数据list中的一个元素
                            <Flex className="group-item" justify="around" key={item.id}>
                                <div className="desc">
                                    <p className="title">{item.title}</p>
                                    <span className="info">{item.desc}</span>
                                </div>
                                {/* 后端的图片地址 */}
                                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                            </Flex>
                        )} 
                    />
                </div>
                
                {/* 最新资讯 */}
                <div className="news">
                    <h3 className="group-title">最新资讯</h3>
                    {/* WingBlank组件,用来设置页面两侧的留白 */}
                    <WingBlank size="md">
                        {this.renderNews()}
                    </WingBlank>
                </div>
            </div>
        );
    }
}