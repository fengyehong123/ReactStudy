import axios from 'axios';
import { BASE_URL } from './url';

// 创建axios实例,在实例中指定项目的根URL
const API = axios.create({
    baseURL: BASE_URL
})

// 将创建好的API导出
export { API }