import React from 'react'
import { Flex } from 'antd-mobile';
// 导入withRouter高阶组件
import { withRouter } from 'react-router-dom'
// 导入props校验的包
import PropTypes from 'prop-types'

// 导入我们封装的组件的样式
import './index.scss'

// 使用高阶组件包裹我们自定义的组件之后,才能获取到路由信息,才能解构出history
function SearchHeader({ history, cityName, className }) {

    return (
        /*
            从外部传入className,给控件添加自定义的样式,
            使用.join(' ')方法将数组转换为以空格分隔的字符串
        */
        <Flex className={["search-box", className || ''].join(' ')}>
            {/* 左侧白色区域 */}
            <Flex className="search">
                {/* 位置 */}
                <div
                    className="location"
                    // 点击之后改变地址栏
                    onClick={() => history.push('/citylist')}
                >
                    {/* 当前城市名称 */}
                    <span className="name">{cityName}</span>
                    <i className="iconfont icon-arrow" />
                </div>

                {/* 搜索表单 */}
                <div
                    className="form"
                    onClick={() => history.push('/search')}
                >
                    <i className="iconfont icon-seach" />
                    <span className="text">请输入小区或地址</span>
                </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
                className="iconfont icon-map"
                onClick={() => history.push('/map')}
            />
        </Flex>
    )
}

SearchHeader.propTypes = {
    // 字符串类型且为必填项
    cityName: PropTypes.string.isRequired,
}

// 使用高阶路由组件包裹我们封装的组件,使其具备路由功能
export default withRouter(SearchHeader)