import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal
} from 'antd-mobile'

import { API } from '../../../utils/api'

import NavHeader from '../../../components/NavHeader'
import HousePackge from '../../../components/HousePackage'

import styles from './index.module.css'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props);

     /*
      当从/rent/search页面跳转到本页面的时候
      如果选择的小区名称,在进行页面跳转的时候会携带小区id和小区name
      state本质为路由中携带的额外信息
    */
    const { state } = props.location;
    // 小区的名称和id
    const community = {
      name: '',
      id: ''
    };

    /*
      如果路由中有额外信息的话,说明是从/rent/search跳转过来的
    */ 
    if (state) {
      // 将路由中携带的name和id保存到community对象中
      community.name = state.name;
      community.id = state.id;
    }

    this.state = {
      // 临时图片地址
      tempSlides: [],
      // 小区的名称和id
      community,
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }

  /*
    获取表单元素
    1. 创建方法getValue作为三个组件的事件处理程序
    2. 该方法接收两个参数:
      name: 当前的状态名
      value: 当前输入值或者选中值
    3. 分别给 InputItem/TextareaItem/Picker组件,添加onChange配置项
    4. 分别调用getValue并传递name和value两个参数(注意: Picker组件的选中值为数组,而接口需要字符串,所以获取索引号为0的值即可)
  */
  getValue = (name, value) => {

    // 获取到输入项的名称和值,更新到状态中
    this.setState({
      // 使用了ES6的属性表达式
      [name]: value
    })
  }

  // 处理房屋配置项目
  handleSupporting = (selected) => {
    // 获取到的多个配置项是数组,我们将数组转化为 | 分隔的字符串
    this.setState(() => {
      return {
        supporting: selected.join('|')
      }
    })
  }

  /*
    处理上传的图片
    files: 上传的图片对象(数组,存储着图片的base64地址)
    type: 当前操作的类型(添加?更新?删除?)
    index: 如果是删除操作的话,返回删除图片的索引
  */
  handleHouseImg = (files, type, index) => {
    this.setState(() => {
      return {
        tempSlides: files
      }
    })
  }

  /*
    上传房屋数据到后台
  */
  addHouse = async () => {

    // 获取出当前组件中的临时图片地址
    const { tempSlides } = this.state;

    // 后台返回的上传成功之后的图片地址(我们处理为以|进行分隔)
    let houseImg = '';

    // 如果已经有上传的图片了
    if (tempSlides.length > 0) {
      // 构建FormData对象,通过该对象上传图片
      const form = new FormData();
      // 遍历当前房源临时地址,将地址添加到FormData对象中
      tempSlides.forEach((item) => form.append('file', item.file));

      // 调用后端接口,发送请求
      const res = await API.post('/houses/image', form, {
        // 因为我们上传了图片,因此需要单独执行请求头的Content-Type
        headers: {
          // 表示上传的是文件,而不是普通的表单数据
          'Content-Type': 'multipart/form-data'
        }
      })

      houseImg = res.data.body.join('|');
    }
  }

  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
      // 房屋的大小
      size
    } = this.state

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        {/* 房源信息 */}
        <List
          className={styles.header}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          {/* 相当于form表单的input元素 */}
          <InputItem placeholder="请输入租金/月" extra="￥/月" value={price} onChange={(val) => this.getValue('price', val)}>
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem placeholder="请输入建筑面积" extra="㎡" value={size} onChange={(val) => this.getValue('size', val)}>
            建筑面积
          </InputItem>
          <Picker data={roomTypeData} value={[roomType]} cols={1} onChange={(val) => this.getValue('roomType', val[0])}>
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker data={floorData} value={[floor]} cols={1} onChange={(val) => this.getValue('floor', val[0])}>
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker data={orientedData} value={[oriented]} cols={1} onChange={(val) => this.getValue('oriented', val[0])}>
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        {/* 房屋标题 */}
        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(val) => this.getValue('title', val)}
          />
        </List>

        {/* 房屋图像 */}
        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            // 当组件中的tempSlides有值的时候,就会把图片展示在控件上
            files={tempSlides}
            // 对图片进行添加/更新/删除操作的时候,就会触发handleHouseImg事件
            onChange={this.handleHouseImg}
            multiple={true}
            className={styles.imgpicker}
          />
        </List>

        {/* 房屋配置 */}
        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          {/* 获取房屋配置数据 */}
          <HousePackge select onSelect={this.handleSupporting} />
        </List>

        {/* 房屋描述 */}
        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={(val) => this.getValue('description', val)}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
