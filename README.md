# 虚拟DOM
**虚拟DOM的本质**
使用JS对象来模拟DOM树,就是用JS表示的UI元素

**DOM和虚拟DOM的区别**
+ DOM是由浏览器中的JS提供功能,所以我们只能人为的使用浏览器提供的固定的API来操作DOM对象.
+ 虚拟DOM: 并不是由浏览器提供的,而是我们程序员手动模拟实现的类似于浏览器中的DOM,但是有着本质的区别.

**虚拟DOM的目的**
以页面表格为例,在不使用虚拟DOM的情况下,如果我们想让表格进行排序的话,会把整个DOM树都更新一遍,然后把排序之后的结果显示在页面上.仅仅只有一小部分数据的排序发生了变化,而大部分数据的排序没有发生变化的情况下进行整个DOM树的更新是会消耗性能的.因此使用虚拟DOM,让变更前和变更后的DOM树进行比较,只更新变更的部分,从而实现DOM节点的高效更新.

**Diff算法**
+ `tree diff`: 新旧DOM树逐层对比的方式,就叫做tree diff,每当我们从前到后,把所有层的节点对比完后,必然能够找到那些需要被更新的元素.
+ `component diff`: 在对比每一层的时候组件之间的对比,叫做component diff.
当对比组件的时候,如果两个组件的`类型相同`,则暂时认为这个组件不需要被更新.
如果组件的类型不同,则立即将旧组件移除,新建一个组件,替换到被移除的位置.
+ `element diff`: 在组件中,每个元素之间也要进行对比,那么元素级别的对比,叫做 element diff.
+ `key`: key这个属性,可以把页面上的DOM节点和虚拟DOM中的对象,做一层关联关系.

# React
在React的学习中,需要安装两个包.`react`和`react-dom`
`npm install react react-dom -S`
+ *react*这个包,是专门用来创建React组件,组件声明周期等这些东西的
+ *react-dom*里面主要封装了和DOM操作相关的包.比如要组件渲染到页面上

**React项目的创建**
1. 运行`npm install react react-dom -S`来安装包
2. 在项目中导入安装的包
```js
    import React from 'react'
    import ReactDOM from 'react-dom'
```
3. 创建虚拟的DOM节点
```js
    let myH1 = React.createElement('h1', null, '这是一个大大的H1');
```
4. 使用ReactDOM把元素渲染到页面指定的容器中
```js
    ReactDOM.render(
        // 参数1: 要渲染的虚拟DOM元素
        myH1,
        // 参数2: 原生的DOM对象.指定要渲染到页面上的哪个位置中
        document.getElementById('app')
    )
```
5. 使用`npm run dev`来运行项目

**JSX语法的使用**
⚠注意:就算在JS中使用JSX语法,JSX内部在运行的时候,也是得先把类似于HTML这样的标签代码转换为了`React.createElement`这样的形式.也就是说,就算我们写了JSX这样的标签代码,也并不是直接把我们的HTML标签渲染到页面上,而是先转换成`React.createElement`这样的代码,然后再渲染到页面中.`JSX`是一个对程序员友好的语法糖.
1. 如果要使用JSX语法的话,需要先安装相关的语法转换工具
`npm install babel-preset-react -D`
2. 安装完成之后,在`.babelrc`文件中进行配置,添加`react`
```js
    {
        "presets": ["env", "stage-0", "react"],
        "plugins": ["transform-runtime"]
    }
```
3. 如果要在JSX语法内部使用JS代码,那么所有的JS代码都必须写到{}内部
```js
    // 定义的变量
    let mytitle = "这是使用变量定义的title值";
    let myJSX = 
    <div>
        这是使用JSX语法创建的div元素
        // 在JSX内部使用外面定义JS变量
        // 因为{}内部都是JS代码,因此进行字符串或者数学运算也是可以的
        <h1 title = {mytitle + '我想测试能能否拼接成功'}>哈哈哈,JSX真是好用啊</h1>
    </div>
```
4. 当编译引擎在编译JSX代码的时候,如果遇到了`<`的时候就把它当做HTML代码去编译;
如果遇到了`{}`,就把花括号内部的代码当做普通的JS代码去编译;
5. 在`{}`内部可以书写任何符合JS代码规范的代码
6. 在JSX中,如果要为元素添加class属性.那么必须写成`className`,因为class在ES6中是一个关键字
`label`标签中的`for`属性也不能使用.必须要替换成`htmlFor`属性才能使用
```js
    let myJSX = 
    <div>
        // 不能使用class,只能只用className
        <p className="myp">但是,你知道它的本质吗?</p>
        // 不能使用for,因为for也是关键字.要使用htmlFor
        <label htmlFor=""></label>
    </div>
```
7. 在使用JSX创建虚拟DOM的时候,所有的节点必须有`唯一的根元素`进行包裹
8. 在JSX中循环创建10个p标签
```js  
    // 先在JSX外部定义好存放若干个p标签的数组
    let arr = [];
    for(let i = 0; i < 10; i++>) {
        // 和vue一样,给for循环的p标签添加key属性,可以提升循环遍历的速度
        // 因为最终p标签是要放到JSX中使用的,所以key的值需要放到{}中,这样在JSX中才能是一个js语法
        let p = <p className="myp" key={i}>但是,你知道它的本质吗?</p>
        arr.push(p);
    }

    // 在JSX的花括号{}中,直接放入数组即可
    let div = 
    <div>
        {/* 因为arr数组中存放的就是10个遍历好的p标签,因此p标签会在JSX中遍历出来 */}
        {arr}
    </div>
```
9. 如果要在JSX中写注释,那么注释必须放到`{}内部`

**React组件的使用**
抽离组件
使用组件
在webpack.config.js中进行配置
```js
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            { test: /\.(png|gif|bmp|jpg)$/, use: 'url-loader?limit=5000' },
            // 使用正则表达式,能识别.js和.jsx文件
            { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ }
        ]
    }
```
创建后缀类型为.jsx的文件,就可以有语法提示

**组件的种类**
- function构造函数创建的组件
使用function构造函数创建的组件,内部没有state私有数据,只有一个props来接收外界传递过来的数据

- class关键字创建的组件
使用class关键字创建的组件,内部除了有`this.props`这个`只读属性`之外,还有一个专门用于存放
自己私有数据的`this.state`属性,这个state属性是`可读可写`的

🐳 使用function创建的组件,叫做`无状态组件`;使用class创建的组件,叫做`有状态组件`
💧有状态组件和无状态组件最本质的区别就是有无state属性;同时使用class创建的组件,有自己的声明周期函数
💧但是使用function创建的组件,没有自己的声明周期函数

**什么时候使用有状态组件,什么时候使用无状态组件**
- 如果一个组件需要存放自己的私有数据,或者需要在组件的不同阶段执行不同的业务逻辑,这个时候适合用class创建出来的有状态组件
- 如果一个组件只需要根据外界传递过来的props,渲染固定的页面结构的话,这个时候适合使用function创建出来的无状态组件;(使用无状态组件的好处:由于剔除了组件的生命周期,所以运行速度会相对的快一些)

**定义一个无状态组件**
```js
    import React from 'react'
    // 导入我们自定义的组件样式对象
    import inlineStyle from './cmtItemStyles.js'

    // 封装一个评论项组件,这个组件由于不需要自己的私有数据,所以直接定义为无状态组件
    export default function CommentItem(props) {
        
        return (
        // 在React组件中的样式,要放到花括号{}中
        <div style={inlineStyle.boxStyle}>
            <h1 style={inlineStyle.titleStyle}>评论人:{props.user}</h1>
            <h3 style={{fontSize:14, color: 'red'}}>评论内容:{props.content}</h3>
        </div>
        );
    }
```

**定义一个有状态组件**
```js
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
            return (
                <div>
                    <h1 className='cmtlist-titile'>评论列表案例</h1>
                    {/* 我们可以直接在JSX语法内部,使用数组的map函数来遍历数组的每一项,
                    并使用map来返回操作后的最新数组 */}
                    {
                        this.state.cmts.map((item, i) => {
                            return (
                                // 如果属性过多的情况下,可以使用属性扩散来快速传递属性
                                <CommentItem {...item} key={i}></CommentItem>
                            );
                        })
                    }
                </div>
            );
        }
    }
```

**CSS模块化**
在React中,不像Vue那样有私有作用域(Vue使用Scope使每个组件都有私有作用域)
React中导入的样式都是全局的,但是组件和组件之间的样式可能会有冲突
为了解决冲突的问题,我们可以用JS对象来模拟样式,但是没有直接写css方便
最终解决办法:
我们在webpack中`启用CSS的模块化`,从而让组件的样式有了私有作用域
🐳 启用方法
- 在webpack中进行配置
```js
    module: {
        rules: [
        // css-loader?modules: 给css-loader添加modules参数,启用CSS的模块化
        // &localIdentName=[name]_[local]-[hash:5] 给我们定义的类名添加一个hash值,保证每一个类名不重名还有语义(默认生成的类名是一串没有语义的英文字母 )                 
        { test: /\.css$/, use: ['style-loader', 'css-loader?modules&localIdentName=[name]_[local]-[hash:5]'] }
    }
```
- 定义css样式
```css
    /* 
        注意: 当启用CSS模块化之后,CSS文件中所有的类名都是私有的
        如果想要把类名设置称为全局的一个类,可以把这个类名用 :global()给包裹起来
        当使用了:global()设置了全局的类样式之后,这个类不会被重命名
        之后私有的类才会被重命名
    */
    :global(.title) {
        color: red;
        text-align: center;
    }
    /* 私有的title */
    .title {
        font-size: 16px;
        color: purple;
    }

    .body {
        font-size: 14px;
        color: red;
    }
```
- 在组件中导入css样式
```js
    // 默认情况下,如果没有为CSS启用模块化,则接受到的itemStyle是一个空对象,因为.css样式表中,不能直接通过JS的export default 导出对象
    // 当启用CSS模块化之后,导入样式表得到的itemStyle就变成了一个样式对象,其中属性名是在样式表中定义的类名,而属性值是自动生成的一个复杂的类名(为了防止类名冲突)
    import itemStyle from '../../css/commentItem.css'
```

**组件的生命周期**
🐳概念: 在组件创建到加载到页面上运行以及组件被销毁的过程中,总是伴随着各种各样的事件,这些在组件特定的时期触发的事件,被统称为组件的生命周期

组件的生命周期分为三个部分:
- 组件的`创建`阶段
    + 创建阶段的生命周期函数,只执行一次
- 组件的`运行`阶段
    + 根据组件的state和props的改变,有选择的触发0次或者多次
- 组件的`销毁`阶段
    + 销毁阶段的生命周期函数,也只执行一次
