// 导入React包
import React from 'react'
import ReactDOM from 'react-dom'

let myH1 = React.createElement('h1', null, '这是一个大大的H1');

// 使用JSX创建虚拟DOM
let mytitle = "这是使用变量定义的title值";
let myJSX = 
  <div>
    这是使用JSX语法创建的div元素
    <h1 title={mytitle}>哈哈哈,JSX真是好用啊</h1>
    {/* 在JSX中,如果要为元素添加class属性.那么必须写成className,因为class在ES6中是一个关键字 */}
    <p className="myp">但是,你知道它的本质吗?</p>
    {/* 不能使用for,因为for也是关键字.要使用htmlFor */}
    <label htmlFor=""></label>
  </div>

// 创建虚拟DOM
let myDiv = React.createElement(
  // 参数1: 字符串类型的参数,表示要创建的元素的类型
  'div',
  // 参数2: 是一个属性对象.表示创建的这个元素上,有哪些属性
  {
    title: 'this is a Div',
    id: 'mydiv'
  },
  // 参数3: 从第三个参数的位置开始,后面可以放很多的虚拟DOM对象.这里的参数表示当前元素的子节点
  '这是一个div',
  // 虚拟DOM对象
  myH1,
  // 使用JSX创建的虚拟DOM
  myJSX
);

// 定义一个对象
let person = {
  name: 'ls',
  age: 22,
  gender: '男',
  address: '北京'
}

// 导入我们写好的组件
import Hello from './components/Hello.jsx'
// 导入我们写好的js文件
// import myclass1 from './class_study.js'
import myclass2 from './class_study2.js'

// 页面元素的渲染
ReactDOM.render(
  // 参数1: 要渲染的虚拟DOM元素
  // myDiv,

  /*
    组件的方式
    ...obj语法是ES6中的属性扩散,表示把对象上的所有的属性都展开了放到这个位置
  */ 
  <Hello {...person} />,
  // 参数2: 原生的DOM对象.指定要渲染到页面上的哪个位置中
  document.getElementById('app')
)
