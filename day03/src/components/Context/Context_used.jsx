import React from 'react'
import ReactTypes from 'prop-types'

// 最外层的父组件
export default class ComObj1 extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            color: 'blue'
        }
    }

    /*
        1. 在父组件中,定义一个function,这个function有个固定的名称,叫做getChildContext
        在这个函数的内部必须要返回一个对象,这个对象就是要共享给所有子组件和子孙组件的自建的数据
    */
    getChildContext() {
        return {
            color: this.state.color
        }
    }

    /*
        2. 使用属性校验,规定一下传递给子组件的数据类型,需要定义一个静态的(static)
        childContextTypes(固定名称,不要修改)
    */
    static childContextTypes = {
        // 使用属性校验,校验需要传递给子组件的color的数据类型
        color: ReactTypes.string
    }

    render() {
        return (
            <div>
                <h1>这个是父组件,通过context的方式向子组件和孙子组件传值</h1>
                <ComObj2></ComObj2>
            </div>
        );
    }
}

// 中间的子组件
class ComObj2 extends React.Component {

    render() {
        return (
            <div>
                <h3>这个是子组件</h3>
                <ComObj3></ComObj3>
            </div>
        );
    }
}

// 内部的孙子组件
class ComObj3 extends React.Component {
    
    // 上来之后,先来个属性校验,去校验一下父组件传递过来的参数类型
    static contextTypes = {
        // 如果子组件想要使用父组件通过context共享的数据,那么在使用之前,一定要做一下数据类型校验
        color: ReactTypes.string
    }

    render() {
        return (
            <div>
                <h5 style={{color: this.context.color}}>这个是孙子组件 === {this.context.color}</h5>
            </div>
        );
    }
}