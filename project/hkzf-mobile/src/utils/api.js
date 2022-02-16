import axios from 'axios';
import { BASE_URL } from './url';
import { getToken, removeToken } from './auth'

// 创建axios实例,在实例中指定项目的根URL
const API = axios.create({
    baseURL: BASE_URL
})

/*
    1. 添加请求拦截器
    2. 获取到当前请求的接口路径(url)
    3. 判断接口路径是否以 /user 开头,并且不是登录或者注册接口(只给主要的接口添加请求头)
    4. 如果是,就添加请求头 Authorization
    5. 添加相应拦截器
    6. 判断返回值中的状态码
    7. 如果是400,表示token超时或者异常,直接移除token
*/
// 添加请求拦截器
API.interceptors.request.use(config => {

    // 从拦截器的配置对象中解构出url
    const { url } = config;

    /*
        以 /user 开头的路径都属于登录后才能访问的页面
        但是 /user/login 和 /user/registered 除外
    */
    if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registered')) {
        // 将本地存储的token添加到请求头中
        config.headers.Authorization = getToken()
    }

    return config;
})

// 添加响应拦截器
API.interceptors.response.use(response => {

    // 获取后端返回的状态码
    const { status } = response.data;
    if (status === 400) {
        // 说明token失效,直接移除token即可
        removeToken(); 
    }

    return response;
})

// 将创建好的API导出
export { API }