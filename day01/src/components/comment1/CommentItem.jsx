import React from 'react'
// 导入我们自定义的组件样式对象
import inlineStyle from './cmtItemStyles.js'

// 导入评论项的样式文件 ⭕:这种直接import的CSS导入方式并不是模块化的CSS
// import '../../css/commentItem.css'

// 默认情况下,如果没有为CSS启用模块化,则接受到的itemStyle是一个空对象,因为.css样式表中,不能直接通过JS的export default 导出对象
// 当启用CSS模块化之后,导入样式表得到的itemStyle就变成了一个样式对象,其中属性名是在样式表中定义的类名,而属性值是自动生成的一个复杂的类名(为了防止类名冲突)
import itemStyle from '../../css/commentItem.css'

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
      <div>
        {/* 使用的js中的样式对象 */}
        <div style={inlineStyle.boxStyle}>
            <h1 style={inlineStyle.titleStyle}>评论人:{props.user}</h1>
            <h3 style={{fontSize:14, color: 'red'}}>评论内容:{props.content}</h3>
        </div>
        <br/>
        {/* 
            使用的是css文件中的样式
            React中并没有像Vue中scoped指令的概念,直接导入CSS可能会引起样式覆盖
        */}
        <div className={itemStyle.box}>
            <h1 className={itemStyle.title}>评论人:{props.user}</h1>
            <h3 className={itemStyle.body}>评论内容:{props.content}</h3>
        </div>
      </div>
    );
  }