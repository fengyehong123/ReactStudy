import React, { Component } from 'react'

import { Carousel, Flex, Modal, Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'

import { BASE_URL } from '../../utils/url'
import { API } from '../../utils/api'
import { isAuth } from '../../utils/auth'

import styles from './index.module.css'

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: BASE_URL + '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    src: BASE_URL + '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    src: BASE_URL + '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}

// 从Modal组件中获取到弹窗组件
const alert = Modal.alert;

export default class HouseDetail extends Component {

  state = {
    isLoading: false,
    // 房屋详情
    houseInfo: {
      // 房屋图片
      houseImg: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '',
      // 房屋面积
      size: 0,
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {},
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    },
    // 房源是否被收藏
    isFavorite: false
  }

  componentDidMount() {

    // 一进入页面就获取房源数据
    this.getHouseDetail();

    // 检查房源是否被收藏
    this.checkFavorite();
  }

  // 获取房屋的详情数据
  async getHouseDetail() {

    // 开始加载数据
    this.setState(() => {
      return {
        isLoading: true,
      }
    })

    // 从浏览器的地址栏中获取配置好的路由参数
    const { params: { id } } = this.props.match;
    const res = await API.get(`/houses/${id}`);
    
    // 将获取到的房源数据保存到组件的状态中
    this.setState(() => {
      return {
        houseInfo: res.data.body,
        // 数据加载完成之后,将状态设置为false
        isLoading: false
      }
    })

    const {
      // 小区名称
      community,
      // 地理位置
      coord
    } = res.data.body;
    
    // 将小区位置渲染在地图上
    this.renderMap(community, coord)
  }

  /*
    检查房源是否收藏
    1. 在state中添加状态: isFavorite(表示是否收藏,默认值是false)
    2. 创建方法 checkFavorite,在进入房源详情页面的时候调用该方法
    3. 先调用 isAuth 方法来判断是否已经登录
    4. 如果未登录,直接 return,不再检查是否收藏
    5. 如果已经登录,从路由参数中,获取到当前房屋的id
    6. 使用API调用接口,查询该房源是否已经收藏
    7. 如果返回的状态码为200,就更新isFavorite'否则就不作任何处理(token过期)
    8. 在页面的结构中,通过状态isFavorite修改收藏按钮的文字和图片内容
  */
  async checkFavorite() {
    // 获取当前登录状态
    const isLogin = isAuth();
    if (!isLogin) {
      // 没有登录
      return;
    }

    // 已经登录
    // 从浏览器的地址栏中获取配置好的路由参数
    const { params: { id } } = this.props.match;
    const res = await API.get(`/user/favorites/${id}`);

    const { status, body } = res.data;
    // 请求成功,更新当前房源的收藏状态
    if (status === 200) {
      this.setState(() => {
        return {
          isFavorite: body.isFavorite
        }
      })
    }
  }

  /*
    收藏房源
    1. 给收藏按钮绑定单击事件,创建方法 handleFavorite 作为事件处理程序
    2. 调用 isAuth 方法,判断用户是否登录
    3. 如果用户未登录,则使用Modal.alert 提示用户是否去登录
    4. 如果点击取消,则不作任何操作
    5. 如果点击了去登录,就跳转到登录页面,同时传递state(登录后,再回到房源收藏页面)
    6. 根据 isFavorite 来判当前房源是否被收藏
    7. 如果未收藏,就调用添加收藏的接口,添加收藏
    8. 如果已经收藏,就调用删除收藏接口,去除收藏
  */
  handleFavorite = async ()  => {

    const isLogin = isAuth();
    // 获取出路由相关的对象
    const { history, location, match } = this.props;

    if (!isLogin) {
      // 未登录
      return alert('提示', '登录后才能收藏房源,是否去登录?', [
        { text: '取消' },
        { 
          text: '去登录',
          // 点击登录按钮之后,跳转到登录页面
          onPress: () => {
            console.log(location);
            return history.push('/login', {from: location})
          }
        }
      ])
    }

    // 已经登录,获取到当前房源是否被收藏
    const { isFavorite } = this.state;
    // 从路由中获取到当前房屋的id
    const { id } = match.params;
    if (isFavorite) {
      // 已经收藏,就删除收藏
      this.setState(() => {
        return {
          isFavorite: false
        }
      })
      const res = await API.delete(`/user/favorites/${id}`);
      if (res.data.status === 200) {
        // 提示用户取消收藏
        Toast.info('已取消收藏', 1, null, false);
      } else {
        // Token超时
        Toast.info('登录超时,请重新登录', 2, null, false);
      }
    } else {
      const res = await API.post(`/user/favorites/${id}`);
      if (res.data.status === 200) {
        // 提示用户收藏成功
        Toast.info('已收藏', 1, null, false);
        // 就添加收藏
        this.setState(() => {
          return {
            isFavorite: true,
          }
        });
      } else {
        // token超时
        Toast.info('登录超时,请重新登录', 2, null, false);
      }
    }
  }

  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { houseImg },
    } = this.state;

    // houseImg是房源的图片list
    return houseImg.map(item => (
      <a key={item} href="http://itcast.cn">
        <img src={BASE_URL + item} alt="" />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }

  // 渲染房源的标签
  renderTags() {

    const { houseInfo: { tags } } = this.state;

    // 渲染房源的标签
    return tags.map((item, index) => {

      // 如果标签的数量超过3个,后面的标签就都展示第三个标签的样式
      let tagClass = '';
      if (index > 2) {
        tagClass = 'tag3';
      } else {
        tagClass = 'tag' + (index + 1)
      }

      return (
        <span key={item} className={[styles.tag, styles[tagClass]].join(' ')}>
          {item}
        </span>
      )
    })
  }

  render() {

    // 从组件数据中获取出房源的详情的数据
    const { 
      isLoading, 
      houseInfo: {
        // 小区的名称
        community,
        // 房源的标题
        title,
        // 房源的价格
        price,
        // 房型
        roomType,
        // 房源的面积
        size,
        // 楼层
        floor,
        // 房屋的朝向
        oriented,
        // 房屋的配套设施
        supporting,
        // 房屋详情描述
        description
      },
      // 房源的收藏状态
      isFavorite 
    } = this.state

    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavHeader
          className={styles.navHeader}
          // 指定导航栏右侧的内容
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          {community}
        </NavHeader>

        {/* 轮播图 */}
        <div className={styles.slides}>
          {/* 为了轮播图能自动轮播,添加的判断 */}
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>
            {/* 房源的标题 */}
            {title}
          </h3>
          <Flex className={styles.tags}>
            <Flex.Item>
              {
                // 渲染房源的标签
                this.renderTags()
              }
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                {/* 一个房屋可以有多个朝向,使用顿号分隔的字符串表示 */}
                <span className={styles.title}>朝向：</span>{
                  oriented.join('、')
                }
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {
            // 房屋配套设施无数据的话,展示无数据组件的数据
            supporting.length === 0 ? (<div className={styles.titleEmpty}>暂无数据</div>) 
            : (<HousePackage list={supporting} />)
          }
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {description || '暂无房屋描述'}
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              <HouseItem {...item} key={item.id} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          {/* 给收藏按钮绑定单击事件 */}
          <Flex.Item onClick={this.handleFavorite}>
            <img
              // 房源被收藏,显示高亮星号图标;未收藏,显示不高亮的星号图标
              src={BASE_URL + (isFavorite ? '/img/star.png' :'/img/unstar.png')}
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>{isFavorite ? '已收藏' : '收藏'}</span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
