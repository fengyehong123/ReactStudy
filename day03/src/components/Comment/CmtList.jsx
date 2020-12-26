import React from 'react'
// 导入评论项组件
import CmtItem from './CmtItem.jsx'
// 导入评论框组件
import CmtBox from './CmtBox.jsx'

// 评论列表组件
export default class CMTList extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            list: [
                {user: '张三', content: '我是张三'},
                {user: '李四', content: '我是李四'},
                {user: '王五', content: '我是王五'},
            ]
        }
    }

    // 生命周期函数,在组件尚未渲染的时候,就读取本地localStorage中的数据
    componentWillMount() {
        this.loadCmts()
    }

    render() {
        return (
            <div>
                <h1>这是评论列表组件</h1>

                {/* 
                    发表评论的组件
                    我们希望当用户评论完之后,能立马把用户评论的内容显示在评论框组件中
                    也就意味着CmtBox子组件中会用到父组件CMTList中的loadCmts方法
                    也就意味着我们需要把父组件中的方法传递到子组件中

                    reload={this.loadCmts} 代表我们把父组件中的loadCmts()方法传递到了子组件中

                    Vue中,把父组件传递给子组件的普通属性和方法属性来区别对待
                        1. 普通属性使用props来接收
                        2. 方法使用this.$emit('方法名')
                    React中
                        只要是传递给子组件的数据,不管是普通的类型还是方法,都可以使用this.props来调用
                */}
                <CmtBox reload={this.loadCmts}></CmtBox>
                <hr />

                {/* 循环渲染一些评论内容的组件 */}
                {
                    this.state.list.map((item, i) => {
                        // 评论项组件
                        return <CmtItem key={i} {...item}></CmtItem>
                    })
                }
            </div>
        );
    }

    // 从本地存储中加载评论列表
    loadCmts = () => {

        let listObj = JSON.parse(localStorage.getItem('cmts') || '[]');

        this.setState({
            list: listObj
        })
    }
}