// 获取环境变量中配置的URL地址,并导出
export const BASE_URL = process.env.REACT_APP_URL

/*
    1. 在项目根目录中创建文件 .env.development
    2. 在该文件中添加环境变量 REACT_APP_URL（注意：环境变量约定REACT_APP 开头）,
    3. 设置 REACT_APP_URL=http://localhost:8080
    4. 重新启动脚手架，脚手架在运行的时候就会解析这个文件
    5. 在utils/url.js 中，创建 BASE_URL 变量，设置值为 process.env.REACT_APP_URL
    6. 导出BASE_URL之后,其他页面就可以使用了
*/