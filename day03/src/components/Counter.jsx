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
            msg: 'ok',
            // 基数,把外界传递过来的initcount赋值给state中的count值,
            // 这样就把count值改成了可读可写的state属性.今后就可以实现点击按钮来实现+1的需求了
            count: props.initCount
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

    /*
        在组件即将挂载到页面上的时候执行,此时组件尚未挂载到页面中;内存中的虚拟DOM还没有开始创建
        这个函数相当于Vue中的created生命周期函数
        UNSATE_componentWillMount()函数就是componentWillMount()函数,但是在React16.3版本之后
        这个函数要被逐渐淘汰了,如果要使用这些方法,官方推荐方法前面加上UNSAFE_.这些方法被认为是“不安全的”,
        因为React团队期望依赖于这些方法的代码更有可能在React的未来版本中出现错误.
    */ 
    UNSATE_componentWillMount() {
        /*
            此时无法获取到页面上的任何元素,因为虚拟DOM和页面都还没有开始创建
            在这个阶段中,不能去操作页面上的DOM元素
        */ 
        console.log(document.getElementById('myh3'));  // null
        // 可以获取到外界传递到组件中的数据
        console.log(this.props.initCount);  // 3
        // 可以获取到组件的初始值
        console.log(this.state.msg);  // ok
        // 可以调用组件中的函数
        this.myselfFunc();  // 这是我自己定义的函数,和生命周期函数无关
    }

    /*
        当执行到render生命周期函数的时候,就要开始渲染内存中的虚拟DOM了,当这个函数执行完毕,内存中就有一个渲染好的虚拟DOM
        但是这个时候页面上海没有真正的显示DOM元素
    */ 
    render() {
        // 在return之前,虚拟DOM还没有开始创建,页面上也是空的,根部无法获取到任何的元素
        // console.log(`render函数执行前尝试获取DOM元素:${document.getElementById('myh3')}`);  // render函数执行前尝试获取DOM元素:null

        // JS中的短路运算.只有当this.refs.h3不为空的手才会执行 this.refs.h3.innerHTML
        // 在组件运行阶段,每当调用render函数的时候,页面上的DOM元素还是之前旧的
        console.log(this.refs.h3 && "函数运行阶段" + this.refs.h3.innerHTML);

        /*
            不能在render函数中使用setState函数,因为没当state被修改的时候就会触发render函数,
            而render函数中又有setState函数,又会修改state状态,从而又会调用render函数,
            从而陷入了无线循环的情况
            this.setState({
                count: this.state.count + 1
            })
        */

        return (
            <div>
                <h1>这个是Counter计数器组件</h1>
                {/* 
                    使用React中的点击事件onClick
                    在React的onClick事件中的this指向组件Counter这个实例
                */}
                <input type="button" value="+1" id="btn" onClick={this.increment} />
                <hr/>
                {/* 和Vue中ref属性类似,React中也有这样的用法 */}
                <h3 id="myh3" ref="h3">当前的数量是: {this.state.count}</h3>
            </div>
        );
        // 当return执行完毕之后,虚拟DOM创建好了,但是还没有挂载到真正的页面中
    }

    // 必须要使用箭头函数这种形式,否则函数中this.setState会报错
    increment =() => {
        this.setState({
            count: this.state.count + 1
        });
    }

    /*
        当组件挂载到页面上之后,会进入这个生命周期函数,只要进入了这个生命周期函数,说明页面上已经有可见的DOM元素了
        在这个函数中,我们可以去页面上操作需要使用的DOM元素
        如果我们想要操作DOM元素,最早只能在componentDidMount生命周期函数中进行
        这个函数相当于Vue中的mounted()函数
        当组件执行完componentDidMount函数之后,就进入到了运行中的状态,所以componentDidMount是创建阶段的最后一个函数
    */
    componentDidMount() {
        console.log(`在componentDidMount()方法中尝试获取DOM元素:${document.getElementById('myh3')}`);  // 在componentDidMount()方法中尝试获取DOM元素:[object HTMLHeadingElement]

        /*
            onclick事件对应的函数要使用箭头函数的方式,如果使用function方式的话函数中的this会指向function函数
            而并不会指向组件.如果指向function函数的话,this.setState({})就会报错,因为function中并没有这个函数
        */

        /*
            // 虽然原生DOM事件在React中也可以使用,但是React官方并不推荐使用,官方推荐使用React中的事件
            document.getElementById('btn').onclick = () => {
                // 通过setState函数来修改组件中的私有数据
                this.setState({
                    count: this.state.count + 1
                });
            }
        */
    }

    /*
        从这里开始,就进入到了组件的运行中的状态
        通过这个生命周期函数来判断组件是否需要更新
        如果函数返回true,则组件更新
        如果函数返回false,则组件不更新
    */
    shouldComponentUpdate(nextProps, nextState) {
        /*
            在该函数中要求必须返回一个布尔值
            如果返回的是false,则不会继续执行后面的声明周期函数,而是直接退回到了运行中的状态
            此时后续的render函数并没有被调用,因此页面并不会被更新,但是组件的state状态却被修改了
        */

        // 需求: 如果state中的count是偶数则更新页面,如果count是奇数则不更新页面

        /*
            console.log(this.state.count); 
            经过打印测试发现,在shouldComponentUpdate中,通过this.state.count获取到的值是上一次的旧数据,并不是最新的
        */
        console.log(this.state.count + '-----' + nextState.count);  // 0-----1

        // return this.state.count % 2 === 0 ? true : false;
        // 因为this.state.count获取到的是上一次的旧数据,因此我们不能使用this.state.count.使用nextState才能获取到最新的数据
        // return nextState.count % 2 === 0 ? true : false;

        return true;
    }

    /*
        组件将要更新,此时还没有更新,在进入这个生命周期函数的时候,内存中的虚拟DOM是旧的,页面上的DOM元素也是旧的
    */
    UNSAFE_componentWillUpdate() {
        console.log("UNSAFE_componentWillUpdate函数执行了");
        // 经过分析打印,此时页面上的DOM节点都是旧的,应该慎重操作,因为可能操作的是旧DOM
        console.log(document.getElementById('myh3').innerHTML);  // 当前的数量是: 0
        // react中Ref属性的使用(和Vue的用法类似)
        console.log(this.refs.h3.innerHTML);
    }

    /*
        组件完成而来更新
        此时state中的数据,虚拟DOM,页面上的DOM都是最新的,这个时候可以放心大胆的去操作页面了
    */
    componentDidUpdate() {
        console.log("componentDidUpdate函数执行了");
        console.log(this.refs.h3.innerHTML);
    }

    myselfFunc() {
        console.log("这是我自己定义的函数,和生命周期函数无关");
    }
}