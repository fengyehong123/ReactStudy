import React, { Component } from 'react'
// 导入Spring动画组件
import { Spring } from 'react-spring/renderprops'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

// 导入自定义的axios
import { API } from '../../../../utils/api'

import styles from './index.module.css'

/*
  控制FilterPicker组件的展示和隐藏:
    1. 在Filter组件中,提供控制对话框展示或隐藏状态: openType(表示展示的对话框的类型)
    2. 在render中判断openType值为area/mode/price时,就展示FilterPicker组件以及遮罩层
    3. 在onTitleClick方法中,修改状态openType为当前type,展示对话框
    4. 在Filter组件中,提供onCancel方法,作为取消按钮和遮罩层的事件处理程序
    5. 在onCancel方法中,修改状态openType为空,隐藏对话框
    6. 将onCancel通过props传递给FilterPicker组件,在取消按钮的单击事件中调用该方法
    7. 在Filter组件中,提供onSave方法,作为确定按钮的事件处理程序,逻辑同上
*/

/*
  标题的高亮状态
    true: 表示高亮
    false: 表示不高亮
*/
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

/*
  FilterPicker和FilterMore组件的选中值
*/
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // 控制标题栏的高亮状态
      titleSelectedStatus,
      // 控制FilterPicker或者FilterMore组件的展示或者隐藏
      openType: '',
      // 所有房源的筛选条件数据
      filtersData: {},
      // 控制FilterPicker组件的默认选中值
      selectedValues
    }

    // 改变onTitleClick函数中的this指向问题
    this.onTitleClick = this.onTitleClick.bind(this);
  }

  /*
    解决展示条件筛选对话框之后,页面滚动的问题
    1. 在componentDidMount中,获取到body,并存储在this中(htmlbody)
    2. 在展示对话框的手,给body添加类body-fixed
    3. 在关闭对话框(取消或者确定)的时候,移动body的类body-fixed
  */
  componentDidMount() {

    // 获取到页面的body属性
    this.htmlBody = document.body;

    // 获取当前城市所对应的房源查询条件
    this.getFiltersData();
  }

  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市的id,根据城市id来获取当前城市对应的房屋查询条件
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)
    
    // 将获取到的房源数据过滤条件保存到组件的状态数据中
    this.setState({
      filtersData: res.data.body
    })
  }

  /*
    点击标题菜单实现高亮,type为当前点击的标题的类型
    因为父组件提供了状态值的存储,因此状态值的修改也需要父组件提供
    当点击标题的时候,让当前点击的标题高亮并且展示当前标题所对应的对话框
  */ 
  onTitleClick(type) {

    // 给body添加样式(防止遮罩层打开之后,页面还能滚动)
    this.htmlBody.className = 'body-fixed';

    /*
      1. 在标题点击事件onTitleClick方法中,获取到两个状态:标题选中状态对象和筛选条件的选中值对象
      2. 根据当前标题选中状态对象,获取到一个新的标题选中状态对象(newTitleSelectedStatus)
      3. 使用Object.keys()方法,遍历标题选中状态对象
      4. 先判断是否是当前标题,如果是的话,就直接让该标题选中状态为true(高亮)
      5. 否则,分别判断每个标题的选中值是否与默认值相同
      6. 如果不同,就设置该标题的选中状态为true
      7. 如果相同,就设置该标题的选中状态为false
      8. 更新状态titleSelectedStatus的值为: newTitleSelectedStatus
    */
    const {
      // 标题选中状态对象
      titleSelectedStatus, 
      // 标题选中值
      selectedValues
    } = this.state;

    // 创建新的标题选中对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    // 遍历标题选中状态对象
    for (const [, item] of Object.keys(newTitleSelectedStatus).entries()) {

      // 如果当前点击的标题栏对象和遍历的对象相同的话,就设置给高亮
      if (item === type) {
        // 高亮
        newTitleSelectedStatus[item] = true;
        continue;
      }

      // 其他未被点击的标题,根据标题名称获取出标题对应的选中值
      const selectedVal = selectedValues[item];
      if (item === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        // 高亮
        newTitleSelectedStatus[item] = true;
      } else if (item === 'mode' && selectedVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[item] = true;
      } else if (item === 'price' && selectedVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[item] = true;
      } else if (item === 'more' && selectedVal.length !== 0) {
        // 高亮
        newTitleSelectedStatus[item] = true;
      } else {
        newTitleSelectedStatus[item] = false;
      }
    }

    this.setState(() => {
      return {
        // 将新的标题选中对象赋给给组件的标题状态选中对象
        titleSelectedStatus: newTitleSelectedStatus,
        // 根据当前点击的标题展示相应的对话框
        openType: type,
      }
    })
  }

  // 取消隐藏对话框
  onCancel = (type) => {

    // 取消整个页面的body样式,保证对话框隐藏之后,页面可以滚动
    this.htmlBody.className = '';

    const {
      // 标题选中状态对象
      titleSelectedStatus,
      // 获取标题选中值
      selectedValues
    } = this.state;

    // 创建新的标题选中对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    const selectedVal = selectedValues[type];

    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === 'more' && selectedVal.length !== 0) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }

    this.setState({
      // 当该状态值设置为空,就可以隐藏对话框
      openType: '',
      // 更新标题选中对象
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  /*
    点击确定按钮,调用的函数
    type和value是子组件调用父组件中方法时,传入的参数
  */ 
  onSave = (type, value) => {
    
    // 取消整个页面的body样式,保证对话框隐藏之后,页面可以滚动
    this.htmlBody.className = '';

    const {
      // 标题选中状态对象
      titleSelectedStatus, 
    } = this.state;

    // 创建新的标题选中对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    const selectedVal = value;
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === 'more' && selectedVal.length !== 0) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }

    // Filter组件最新的选中值
    const newSelectedValues = {
      // 解构出所有默认的选中值
      ...this.state.selectedValues,
      // 使用当前传入的选中值替换默认的选中值
      [type]: value
    }

    // 根据Filter组件最新的选中值,构建房源筛选条件,构建完成的筛选条件需要传递给父组件HouseList
    const filters = {};

    // 构建各个标题的筛选条件
    const { area, mode, price, more } = newSelectedValues;
    // 构建区域的筛选条件
    const areaKey = area[0];
    let areaValue = 'null';
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1];
    }
    filters[areaKey] = areaValue;
    
    // 构建方式和租金的筛选条件
    filters.mode = mode[0];
    filters.price = price[0];

    // 更多的筛选条件
    filters.more = more.join(',');

    // 调用父组件中传递来的方法,将子组件的数据传递给父组件
    this.props.onFilter(filters);

    // 改变组件的状态
    this.setState(() => {

      return {
        // 将打开的对话框类型设置为空,隐藏对话框
        openType: '',
        // 更新标题选中对象
        titleSelectedStatus: newTitleSelectedStatus,
        // 改变FilterPicker组件的默认选中值
        selectedValues: newSelectedValues
      }
    })
  }

  // 渲染FilterPicker组件的方法
  renderFilterPicker() {

    /*
      解构出当前点击的标题的类型
      从filtersData中进一步解构出房源的过滤条件数据
    */ 
    const { 
      openType, 
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state;

    // 获取FilterPicker组件的默认选中值
    let defaultValue = selectedValues[openType];

    // 当前被点击的标题是不是下面这三个之一的时候,不渲染组件
    if(!['area', 'mode', 'price'].includes(openType)) {
      return null;
    }

    // 组装FilterPicker组件中需要用到的数据
    const map = new Map([
      ['area', {
        // 展示数据所用到的列数
        cols: 3,
        // 数据需要展示的数据
        data: [area, subway]
      }],
      ['mode', {
        cols: 1,
        data: rentType
      }],
      ['price', {
        cols: 1,
        data: price
      }]
    ]);

    // 根据openType来获取到当前条件下的过滤数据
    const {cols, data: filterData} = map.get(openType);

    // 渲染FilterPicker组件(我们向该组件中传递了数据源)
    return (
      <FilterPicker
        /*
          问题: 在前端三个标题之间来回切换时,默认选中值不生效,当重新发开FilterPicker组件的时候,才会生效
          分析: 两种操作方式的区别在于有没有重新创建FilterPicker组件.只要组件被重新创建,默认值的选中就会生效
          原因: 不重新创建FilterPicker组件时,不会再次执行state初始化,这样也就无法获取最新的props
          解决方法: 给FilterPicker组件添加key值为openType,这样在不同标题之间切换时,key的值都不相同,React内部
          会在key不相同的时候,重新创建该组件,只要组件被重新创建,默认值的选中就会生效
          下面的key={openType}就是为了解决该问题添加的
        */
        key={openType}
        onCancel={this.onCancel} 
        onSave={this.onSave} 
        // 组件的过滤数据
        data={filterData} 
        // 组件数据所占用的列数
        cols={cols} 
        // 点击组件的类型
        type={openType}
        // 组件的默认选中值
        defaultValue={defaultValue}
      />
    )
  }

  /*
    1. 封装renderFilterMore方法,渲染FilterMore组件
    2. 从filtersData中,获取数据(roomType,oriented,floor,characteristic),通过props传递给FilterMore组件
    3. FilterMore组件中,通过props获取到数据,分别将数据传递给renderFilters方法
    4. 在renderFilters方法中,通过参数接收数据,遍历数据,渲染标签
  */
  renderFilterMore() {

    // 从组件状态中解构出标题类型和房源过滤条件
    const {
      // 当前标题的类型
      openType,
      // 组件的默认选中值
      selectedValues,
      // FilterMore组件相关的过滤数据
      filtersData: {
        roomType,
        oriented,
        floor,
        characteristic
      }
    } = this.state;

    // 如果点击的不是筛选标题的话,就停止渲染下面的组件
    if (openType !== 'more') {
      return null;
    }

    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }

    // 获取到FilterMore组件的默认选中值
    const defaultValue = selectedValues.more;
    return (
      <FilterMore 
        data={data}
        // 当前标题的类型
        type={openType}
        // 父组件将保存方法传递给FilterMore子组件,当子组件点击确定按钮的时候,就可以把子组件选中的数据传递给父组件
        onSave={this.onSave}
        onCancel={this.onCancel}
        // 当前组件的默认选中值
        defaultValue={defaultValue}
      />
    )
  }

  /*
    实现遮罩层动画
    1. 创建方法renderMask来渲染遮罩层div
    2. 修改渲染遮罩层的逻辑,保证Spring组件一直都被渲染(Spring组件都被销毁了,就无法实现动画效果)
    3. 修改to属性的值,在遮罩层隐藏时为0,在遮罩层展示时为1
    4. 在render-props的函数内部,判断props.opacity是否等于0
    5. 如果等于0,就返回null(不渲染遮罩层),解决遮罩层遮挡页面导致顶部导航失效的问题
    6. 如果不等于0,渲染遮罩层div
  */
  renderMask() {

    const { openType } = this.state;
    // 当不包含'area', 'mode', 'price'的时候,遮罩层需要隐藏
    const isHide = !['area', 'mode', 'price'].includes(openType);

    /*
      当前被点击的标题是'area'或者'mode'或者'price'时候,就展示遮罩层
      我们给遮罩层绑定了单击事件,当点击的时候,触发onCancel方法,隐藏遮罩层
    */ 
    return (

      // 使用Spring动画组件,给遮罩层添加动画效果
      <Spring
        from={{opacity: 0}}
        to={{opacity: isHide ? 0 : 1}}
      >
        {props => {

          /*
            props => {opacity: 0}是从0到1的中间值
            如果props.opacity为0的话,说明遮罩层已经完成动画效果,已经隐藏了
          */ 
          if (props.opacity === 0) {
            /*
              完成动画效果之后,遮罩层就不需要渲染了,防止遮挡其他按钮,导致按钮无法点击
              在Spring组件内部返回null,可以保证遮罩层消失的时候,有动画效果,
              如果在Spring组件外部返回null,Spring组件都没有被加载,当遮罩层消失的时候,
              也就不会有动画效果
            */ 
            return null;
          }

          return (
            <div
              style={props}
              // 遮罩层的样式
              className={styles.mask}
              // 点击遮罩层只有,触发onCancel事件,隐藏遮罩层
              onClick={() => this.onCancel(openType)} 
            />
          )
        }}
      </Spring>
    )
  }

  render() {

    // 从当前父组件的状态中解构出需要的数据
    const { titleSelectedStatus} = this.state;

    return (
      <div className={styles.root}>

        {/* 渲染遮罩层 */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {
            // 调用自己封装的渲染FilterPicker组件的方法
            this.renderFilterPicker()
          }

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
