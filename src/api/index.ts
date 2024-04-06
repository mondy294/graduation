// 引入api接口
import requests from "./ajax";

// 注册用户接口
export const Register = (data: any) => {
    return requests({
        url: '/register',
        method: 'post',
        data,
    })
}
// 用户登录接口
export const Login = (data: any) => {
    return requests({
        url: '/login',
        method: 'post',
        data,
    })
}
//获取所有可购买订单
export const Trade = () => {
    return requests({
        url: '/trade',
        method: 'get',
    })
}

