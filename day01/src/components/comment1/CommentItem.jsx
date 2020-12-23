import React from 'react'
// 导入我们自定义的组件样式对象
import inlineStyle from './cmtItemStyles.js'

// 封装一个评论项组件,这个组件由于不需要自己的私有数据,所以直接定义为无状态组件
export default function CommentItem(props) {
    /*
        ⭕: 如果要使用style属性为JSX语法创建DOM元素并且设置样式,不能像网页中那么写样式
        而是要使用JS语法来写样式
        ⭕: 在写style样式的时候,外层的{}表示要写JS代码,内层的{}表示要用一个JS表达式
        ⭕: 在style的样式规则中,如果属性值的单位是px,则px可以省略,直接写一个数值即可
    */ 

    /*
        样式优化1: 我们可以把css样式单独放到一个对象中
        const boxStyle = {
            border:'1px solid #ccc', 
            margin:"10px 0", 
            paddingLeft: 15
        }
        const titleStyle = {
            fontSize: 16, 
            color:'purple'
        }

        样式优化2: 我们可以把样式对象封装到唯一的一个对象中
        const inlineStyle = {
            boxStyle: {
                border:'1px solid #ccc', 
                margin:"10px 0", 
                paddingLeft: 15
            },
            titleStyle: {
                fontSize: 16, 
                color:'purple'
            }
        }

        样式优化3: 我们可以把样式对象放到一个JS文件中,然后将样式对象导出,并在这个组件中导入
    */
    
    return (
      <div style={inlineStyle.boxStyle}>
        <h1 style={inlineStyle.titleStyle}>评论人:{props.user}</h1>
        <h3 style={{fontSize:14, color: 'red'}}>评论内容:{props.content}</h3>
      </div>
    );
  }