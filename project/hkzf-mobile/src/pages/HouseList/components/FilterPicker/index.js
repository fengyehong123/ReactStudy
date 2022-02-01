import React, { Component } from 'react'
import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

/*
  获取选中值
    1. 在FilterPicker组件中,添加状态value(用于获取PickerView组件中的选中值)
    2. 给PickerView组件中添加onChange,通过参数获取到选中值,并更新状态中的value
    3. 在确定按钮的事件处理程序中,将type和value作为参数传递给父组件
*/

export default class FilterPicker extends Component {

  constructor(props) {
    super(props);
    // 当前组件的选中状态值
    this.state = {
      value: null,
    }
  }

  render() {

    // 解构父组件传入的数据
    const { onCancel, onSave, data, cols, type } = this.props;
    // 解构出当前组件选中的状态值
    const { value } = this.state;

    return (
      // <></>语法是<React.Fragment>的简化语法,作用:不添加额外的元素,返回多个节点
      <>
        {/* 
          选择器组件
            data: 组件需要用到的数据源
            cols: 数据展示所需要的列数
            onChange: 当更改过滤数据条件的时候,将当前选中项保存到状态中
            value: 当前组件的选中的数值,如果我们不设置的话,当改变过滤条件的时候,会触发onchange事件
                   改变组件中的状态值value,从而导致组件重新渲染,从而导致我们选中的过滤条件不会被选中显示
        */}
        <PickerView data={data} value={value} cols={cols} onChange={val => {
          this.setState({
            value: val
          })
        }} />

        {/* 
          底部按钮
            onSave: 点击确定按钮,将当前标题的名称和当前标题下选中的数据传递给父组件中的onSave()方法
        */}
        <FilterFooter onCancel={() => onCancel()} onOk={() => onSave(type, value)} />
      </>
    )
  }
}
