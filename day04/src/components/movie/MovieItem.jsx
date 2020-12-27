import React from 'react'

export default class MovieItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div>
                <h4>电影名称: {this.props.title}</h4>
            </div>
        );
    }
}