/*
    创建并导出获取定位城市的函数
    1. 判断localStorage中是否有定位城市
    2. 如果没有,就使用首页中获取定位城市的代码来获取,并且存储到本地存储中,然后返回该城市数据
    3. 如果有,直接返回本地存储中的城市数据
*/
import axios from 'axios'

export const getCurrentCity = () => {

    // 将本地存储的json字符串转换为json对象
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'));

    /*
        之所以要把定位信息放到localStorage中
        是因为如果当用户刷新界面之后,依然要显示当前的定位
    */

    // 如果本地中没有存储
    if (!localCity) {

        /*
            因为我们在百度地图的回调函数中又发送了异步请求,
            因此使用Promise来解决回调的问题,此处需要手动进行方法的封装
        */
        return new Promise((resolve, reject) => {

            // 通过IP定位获取到当前城市的名称(以下方法为百度地图的API)
            const currentCity = new window.BMap.LocalCity();
            currentCity.get(async (res) => {

                try {
                    /*
                    res.name为调用百度地图API获取到的当前城市的信息
                    由于API接口只能返回北上广深的城市信息,因此当前城市若不是北上广深的话,默认返回上海的信息
                    */ 
                    const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`);
                    
                    // 将获取到的定位数据存储到本地localStorage中
                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body));
                    
                    // 通过resolve的方式,将返回的数据暴露出去
                    resolve(result.data.body);
                } catch (error) {
                    // 城市定位失败的信息
                    reject(error);
                }
            });
        });
    }
    
    /*
        如果本地存储中有数据,就直接返回本地存储中的城市数据
        注意: 因为本地存储中不存在城市数据的时候,使用了Promise来获取数据
        因此为了函数返回值的统一,此处也应该使用Promise
        因为此处的Promise不会失败,所以不需要new一个Promise,直接返回一个成功的Promise即可
    */
    return Promise.resolve(localCity);
}