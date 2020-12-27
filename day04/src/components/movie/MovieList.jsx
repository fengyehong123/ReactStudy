import React from 'react'

// 导入UI组件
import { Spin, Alert } from 'antd'
// 导入我们抽出去的组件
import MovieItem from './MovieItem.jsx'

export default class MovieList extends React.Component {

    constructor(props){

        super(props);
        this.state = {
            // 电影列表
            movies: [],
            // 当前展示第几页的数据
            nowPage: parseInt(props.match.params.page) || 1,
            // 每页显示多少条数据
            pageSize: 14,
            // 当前电影分类下,总共有多少条数据
            total: 0,
            // 数据是否正在加载,如果为true则表示数据正在加载
            isLoading: true,
            // 保存一下要获取的电影的类型(如果类型是nowPlaying,type就是1;否则type就是2)
            movieType: props.match.params.type == "nowPlaying" ? "1" : "2",
        };
    }

    UNSAFE_componentWillMount() {
        /*
            在React中,我们可以使用fetch_API来获取数据,fetch_API是基于Promise来封装的
        */
        this.loadMovieListByTypeAndPage();
    }

    // 根据电影类型和页码来获取电影数据
    loadMovieListByTypeAndPage = () => {

        // get请求的请求头
        let headersParam = {
            'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"16072567591309810406457345","bc":"310100"}',
            'X-Host': 'mall.film-ticket.film.list'
        };
        // 根据电影的类型(正在热播还是即将上映)+每页多少条数据+当前是第几页来拼凑url
        let url = `https://m.maizuo.com/gateway?cityId=110100&pageNum=${this.state.nowPage}&pageSize=${this.state.pageSize}&type=${this.state.movieType}&k=6341699`;

        /*
            为了防止第三方网站失效或者关闭开发API接口,我们使用本次存储的假数据进行测试
            截止到2020年12月27号,下面的网站的API能正常使用
            this.getMovieDataFromWebSite(url, headersParam); 
        */ 

        // 从本地的json文件读取我们提前准备好的数据
        const data = require('../test_data/in_theaters.json');
        // 我们使用setTimeout函数来模拟查询到了数据
        setTimeout(() => {
            this.setState({
                // 停止加载动画的显示
                isLoading: false,
                // 把从猫眼获取到的电影数据保存到组件的数据列表中
                movies: data.subjects,
                // 把电影的条数保存好
                total: data.total,
            });
        }, 2000)
    }

    // 从第三方网站中获取电影信息
    getMovieDataFromWebSite(url, headersParam) {
        /*
            默认的window.fetch请求有跨域限制.如果网站添加了跨域限制的时候,我们无法直接使用
            我们可以使用第三方包 fetch-jsonp来发送JSONP请求,它的用法和浏览器内置的fetch完全兼容
            安装: npm install fetch-jsonp -S

            使用的时候需要导入一下: import fetchJSONP from 'fetch-jsonp'
        */
        fetch(
            url,
            {headers: headersParam}
        ).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            // 当成功获取到数据之后,修改组件中的数据
            this.setState({
                // 停止加载动画的显示
                isLoading: false,
                // 把从猫眼获取到的电影数据保存到组件的数据列表中
                movies: data.data.films,
                // 把电影的条数保存好
                total: data.data.total,
            })
        })
    }

    /*
        渲染电影列表的方法
    */
    renderList = () => {
        // 如果数据正在加载中,就返回一个提示正在加载的组件
        if(this.state.isLoading) {
            return (
                <Spin tip="Loading...">
                    <Alert 
                        message="正在请求电影列表" 
                        description="精彩内容,马上呈现..." 
                        type="info"
                    >

                    </Alert>
                </Spin>
            );
        } else {
            return (
                <div>
                    {this.state.movies.map(item => {
                        return (
                            // 每循环一次,就新创建一个电影项
                            <MovieItem {...item} key={item.id}></MovieItem>
                        );
                    })}
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {/* 进入该组件的时候,就调用该方法 */}
                {this.renderList()}
            </div>
        );
    }
}