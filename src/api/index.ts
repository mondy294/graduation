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
// 查询订单
export const MyOrder = (params: any) => {
    return requests({
        url: '/myOrder',
        method: 'get',
        params,
    })
}
// 获取好友
export const getFriend = (params: any) => {
    return requests({
        url: '/getFriend',
        method: 'get',
        params,
    })
}

// 添加好友
export const addFriend = (data: any) => {
    return requests({
        url: '/addFriend',
        method: 'post',
        data,
    })
}

// 获取用户信息
export const getUserInfo = (params: any) => {
    return requests({
        url: '/userInfo',
        method: 'get',
        params,
    })
}
// 删除好友
export const cancleFriend = (data: any) => {
    return requests({
        url: '/cancleFriend',
        method: 'post',
        data,
    })
}

// 获取聊天记录
export const getHistory = (params: any) => {
    return requests({
        url: '/getHistory',
        method: 'get',
        params,
    })
}
// 更新聊天记录
export const addHistory = (data: any) => {
    return requests({
        url: '/addHistory',
        method: 'post',
        data,
    })
}
// 获取契约
export const getContract = (params: any) => {
    return requests({
        url: '/getContract',
        method: 'get',
        params,
    })
}

// 获取聊天记录
export const addContract = (data: any) => {
    return requests({
        url: '/addContract',
        method: 'post',
        data,
    })
}
// 更改库存
export const editRepertory = (data: any) => {
    return requests({
        url: '/buyContract',
        method: 'post',
        data,
    })
}





