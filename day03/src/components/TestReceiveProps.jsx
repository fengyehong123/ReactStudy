import React from 'react'

// 父组件
export default class Parent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            msg: '这是父组件中的msg消息'
        }
    }

    render() {
        return (
            <div>
                <h1>这个是父组件</h1>
                <input type="button" value="点击修改父组件中的MSG" onClick={this.changeMsg}></input>
                <hr/>
                {/* 
                    在父组件中使用子组件
                    父组件向子组件中传值
                */} 
                <Son pmsg={this.state.msg}></Son>
            </div>
        );
    }

    // 在父组件内部定义一个修改Msg的函数,要使用箭头函数来定义,这样可以防止箭头函数指向的问题
    changeMsg = () => {
        this.setState({
            msg: "我是Msg,我已经被修改了"
        })
    }
}

// 子组件
class Son extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <div>
                <h3>这个是子组件 --- {this.props.pmsg}</h3>
            </div>
        );
    }

    /*
        组件将要接收外界传递过来的新的props属性值
        当子组件第一次被渲染到页面上的时候,并不会触发这个函数
        只有当父组件中,通过某些事件重新修改了传递给子组件的props数据之后,才会触发UNSAFE_componentWillReceiveProps函数
    */
    UNSAFE_componentWillReceiveProps(nextProps) {

        console.log("UNSAFE_componentWillReceiveProps函数被触发了!");

        console.log(this.props.pmsg);  // 这是父组件中的msg消息
        /*
            注意: 1. 在UNSAFE_componentWillReceiveProps被触发的时候,如果我们使用this.props来获取属性,
                  这个属性值并不是最新的,而是上一次的旧属性值
                  2. 如果想要获取最新的属性值,需要通过UNSAFE_componentWillReceiveProps的函数列表来获取
        */
        console.log(nextProps.pmsg);
    }
}