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
export const Trade = (params: any) => {
    return requests({
        url: '/trade',
        method: 'get',
        params
    })
}
// 购买
export const Purchase = (data: any) => {
    return requests({
        url: '/buy',
        method: 'post',
        data
    })
}
// 撤销商品
export const Cancle = (data: any) => {
    return requests({
        url: '/cancle',
        method: 'post',
        data,
    })
}
// 发布商品
export const Publish = (data: any) => {
    return requests({
        url: '/publish',
        method: 'post',
        data,
    })
}
// 查询库存
export const Repertory = (params: any) => {
    return requests({
        url: '/repertory',
        method: 'get',
        params,
    })
}
// 查询库存
export const MyOrder = (params: any) => {
    return requests({
        url: '/myOrder',
        method: 'get',
        params,
    })
}


