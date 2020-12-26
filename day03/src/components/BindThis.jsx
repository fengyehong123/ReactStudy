import React from 'react'

export default class BindThis extends React.Component {

    constructor(props) {
        
        super(props);
        this.state = {
            msg: "这是默认的msg"
        }

        /*
            绑定this并传参的方式2: 在构造函数中绑定并传参
            注意:
                1. 当为一个函数调用bind改变了this的指向后,bind函数调用的结果会有一个返回值.这个返回值就是被改变this指向后的函数引用
                2. bind并不会修改原函数的this指向,所以我们用bind获取被改变的this指向的函数的引用之后,需要重新赋值给this.changeMsg2
        */ 
       this.changeMsg2 = this.changeMsg2.bind(this, '🧐', '⁉')
    }

    render() {
        return (
            <div>
                <h1>绑定this并传参的几种方式</h1>
                {/* 
                    bind的作用: 为前面的函数修改函数内部的this指向
                    让函数内部的this指向bind参数列表中的第一个参数
                    ⭕bind中的第一个参数是用来修改this指向的
                       第一个参数后面的所有的参数,都会当做将来调用前面函数时候的参数传递进去

                    bind 和 call/apply之间的区别
                        1. call和apply修改完this指向之后,会立即调用前面的函数
                        2. bind只是修改this的指向,并不会进行调用
                */}

                {/* 方式1: 在事件处理函数中,直接使用bind绑定this并传参 */}
                <input type="button" value="绑定this并传参的方式1" onClick={this.changeMsg1.bind(this, '🐳', '💤')}></input>
                <br />
                <input type="button" value="绑定this并传参的方式2" onClick={this.changeMsg2}></input>
                <br />
                {/* 箭头函数外部的this和内部的this会保持一致,会把外部的this强制绑定到内部的this中 */}
                <input type="button" value="绑定this并传参的方式3" onClick={() => {this.changeMsg3('🤝', '☠')}}></input>
                <hr />
                <h3>{this.state.msg}</h3>

                {/* 
                    1. 在Vue中,有v-model指令来实现双向数据绑定,但是在React中,根本就没有指令的概念
                    因此React默认也不支持双向数据绑定
                    2. React只支持把数据从state上传输到页面,但是无法自动实现数据从页面传输到state中进行保存
                    3. React不支持数据的自动逆向传输,只是实现了数据的单向绑定
                    4. Vue通过v-model指令就可以自动实现数据绑定,但是在React中如果要实现数据从页面保存到state中的机制和Vue不同
                       React中是单向数据绑定的,只能从state同步到我们的页面上,但是无法自动从页面中同步到组件的state中
                       如果我们想实现同步的话,需要通过onChange()事件来手动的实现同步

                    ⭕注意:
                    1. 如果为表单元素提供了value属性绑定,那么必须同时为表单元素绑定readOnly或者提供onChange事件
                    2. 如果提供了readOnly,表示这个元素是只读的,不能被修改
                    3. 如果提供了onChange,表示这个元素的值可以被修改,但是要自己定义修改的逻辑
                */}
                <input type="text" value={'我是只读的:' + this.state.msg} style={{width: '100%'}} readOnly></input>
                {/* 
                    通过onChange来手动的实现页面中的数据绑定到组件的state中
                */}
                <input id='ipt' type="text" value={this.state.msg} style={{width: '100%'}} onChange={(e) => {this.txtChanged(e)}} ref="txt"></input>
            </div>
        );
    }

    // 为文本框绑定txtChanged事件
    txtChanged(e) {
        // 如果想让文本框在触发onChange的时候,同时把文本框的最新的值保存到state中.那么我们需要手动调用this.setState
        /*
            获取文本框中最新文本的3种方式:
                1. 使用document.getElementById()来获取
                2. 使用ref来获取
                3. 使用事件对象中的参数e来获取. e.target表示触发这个事件的事件源对象,得到的是一个原生的JS DOM对象
        */
        // 1. 使用document.getElementById()来获取
        let inputObj = document.getElementById('ipt');
        console.log(`通过DOM的方式来获取:${inputObj.value}`);
        // 2. 使用ref的方式来获取
        console.log(`使用ref的方式来获取:${this.refs.txt.value}`);
        // 3. 使用事件对象中的参数e来获取. e.target表示触发这个事件的事件源对象,得到的是一个原生的JS DOM对象
        console.log(`使用事件对象中的参数e来获取:${e.target.value}`);

        // 在onChange事件所对应的txtChanged函数中,通过setState来实现数据源的修改,模拟Vue中的双向绑定
        this.setState({
            msg: e.target.value
        })
    }

    /*
        在这里我们没有使用箭头函数的方式,但是函数里面的this.setState却能起作用的原因是因为我们在调用该函数的时候
        使用bind改变了函数的this指向  
    */ 
    changeMsg1(arg1, arg2) {
        // 注意: 这里的方式是一个普通的方法,因此在触发的时候,这里的this是undefined
        // console.log(this);
        this.setState({
            msg: `绑定this并传参的方式1==> ${arg1} ${arg2} `
        })
    }

    // 在这里使用了在构造函数中进行bind的方式
    changeMsg2(arg1, arg2) {
        this.setState({
            msg: `绑定this并传参的方式2==> ${arg1} ${arg2} `
        })
    }

    // 在这里使用了箭头函数绑定this的方式
    changeMsg3(arg1, arg2) {
        this.setState({
            msg: `绑定this并传参的方式2==> ${arg1} ${arg2} `
        })
    }
}