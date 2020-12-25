import React from 'react'
// 导入PropTypes校验包
import ReactTypes from 'prop-types'

/*
    封装组件的目的是为了团队协作开发更加方便,有的人只负责开发组件,有的人只负责调用别人开发好的组件
    所以最好在封装组件的时候,为组件中的一些必要的数据进行类型校验
*/
export default class Counter extends React.Component {
    /*
        在封装一个组件的时候,在组件的内部肯定有一些数据是必须的,哪怕用户没有传递一些相关的启动参数,
        组件内部也要尽量给提供一些默认值
    */
    constructor(props) {
        super(props);
        // 初始化组件的私有状态,保存的是组件的私有数据
        this.state = {
            msg: 'ok'
        }
    }

    // 在React中,使用静态的defaultProps属性来设置组件的默认属性值
    static defaultProps = {
        // 如果外界没有传递initCount,那么就自己初始化一个为0的数值
        initCount: 0
    }

    /*
        创建一个静态的propTypes对象,在这个对象中,可以把外界传递过来的属性进行类型校验
        注意: 如果要在传递过来的属性进行类型校验,必须安装React提供的第三方包 => prop-types
        prop-types 大概在v15.*之前和react包在一起,从v15.*之后,官方把类型校验的模块单独抽离为一个包,就叫做prop-types
    */
    static propTypes = {
        // 使用prop-types来定义initCount为number类型
        // 如果传递的参数不是number类型的话,会在控制台上打印出error信息
        initCount: ReactTypes.number
    }

    // 在组件即将挂载到页面上的时候执行,此时组件尚未挂载到页面中;内存中的虚拟DOM还没有开始创建
    componentWillMount() {
        /*
            此时无法获取到页面上的任何元素,因为虚拟DOM和页面都还没有开始创建
            在这个阶段中,不能去操作页面上的DOM元素
        */ 
        console.log(document.getElementById('myh3'));  // null
        // 可以获取到外界传递到组件中的数据
        console.log(this.props.initCount);  // 3
        // 可以获取到组件的初始值
        console.log(this.state.msg);  // ok
    }

    render() {
        return (
            <div>
                <h1>这个是Counter计数器组件</h1>
                <input type="button" value="+1" />
                <hr/>
                <h3 id="myh3">当前的数量是: {this.props.initCount}</h3>
            </div>
        );
    }
}