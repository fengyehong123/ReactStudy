const { createContext } = require("react");

import React from 'react'

export default class Movie extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            // 如果想要从路由规则中提取匹配到的参数进行使用的话,可以使用this.props.match.params.*** 来获取
            routeParams: props.match.params
        }
    }

    render() {
        return (
            <div>
                <p>Movie</p>
                <hr/>
                <p>路由的前部分地址为:{this.state.routeParams.type}</p>
                <hr/>
                <p>路由的后部分地址为:{this.state.routeParams.id}</p>
            </div>
        );
    }
}