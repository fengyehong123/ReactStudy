import React from 'react'
// 导入当前组件需要的子组件
import CommentItem from './CommentItem.jsx'

// 定义一个评论列表组件
export default class CommentList extends React.Component {
    constructor(props) {
      super(props);
      // 定义当前评论列表的私有数据
      this.state = {
        cmts: [
          {user: '张三1', content: '哈哈,沙发'},
          {user: '张三2', content: '哈哈,板凳'},
          {user: '张三3', content: '哈哈,凉席'},
          {user: '张三4', content: '哈哈,砖头'},
          {user: '张三5', content: '哈哈,地面'}
        ]
      }
    }
  
    // 在有状态的组件中,render函数是必须的.用来表示渲染哪些虚拟DOM元素并展示出来
    render() {
  
      //#region 循环评论列表的方式1,虽然能使用,但是不合理.我们要尽量把JSX和JS语法结合起来使用
      var arr = [];
      this.state.cmts.forEach((item) => {
        arr.push(<h1>{item.user}</h1>)
      })
      //#endregion
  
      return (
        <div>
          <h1 className='title'>评论列表案例</h1>
          {/* 我们可以直接在JSX语法内部,使用数组的map函数来遍历数组的每一项,并使用map来返回操作后的最新数组 */}
          {
            this.state.cmts.map((item, i) => {
                return (
                  // 我们每循环一遍数组,都创建一个评论项组件
                  // <CommentItem user={item.user} content={item.content} key={i}></CommentItem>
  
                  // 如果属性过多的情况下,可以使用属性扩散来快速传递属性
                  <CommentItem {...item} key={i}></CommentItem>
                );
            })
          }
        </div>
      );
    }
  }