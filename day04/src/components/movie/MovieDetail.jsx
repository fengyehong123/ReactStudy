import React from 'react'
// 导入按钮和加载组件
import { Button, Icon, Spin, Alert } from 'antd'

export default class MovieDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // 电影信息对象
            info: {},
            // 数据是否正在加载(true表示正在加载,还未从豆瓣服务器获取到数据)
            isloading: true
        }
    }

    // 当组件将要挂载之前,先获取数据
    UNSAFE_componentWillMount() {
        // 因为豆瓣服务器已经关闭服务,因此下面的请求会失败
        fetch(`https://api.douban.com/v2/movie/subject/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                info: data,
                isloading: false
            })
        })
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.goBack}>
                    <Icon type="left" />
                    返回电影列表页面
                </Button>

                {this.renderInfo()}
            </div>
        );
    }

    // 点击按钮返回上一个画面
    goBack = () => {
        this.props.history.go(-1)
    }

    // 从豆瓣服务器来获取消息
    renderInfo = () => {
        if (this.state.isloading) {
            return (
                <Spin tip="Loading...">
                    <Alert
                        message="正在请求电影数据"
                        description="精彩内容，马上呈现....."
                        type="info"
                    />
                </Spin>
            );
        } else {
            return (
                <div>
                    <div style={{ textAlign: 'center' }}>
                        <h1>{this.state.info.title}</h1>
                        <img src={this.state.info.images.large.replace('img3', 'img1')} alt="" />
                    </div>
                    <p style={{ textIndent: '2em', lineHeight: '30px' }}>{this.state.info.summary}</p>
                </div>
            );
        }
    }
}