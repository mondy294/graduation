const express = require('express')

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const router = express.Router()


const userhandle = require('../router_handle/user')
//注册
router.post('/register', userhandle.register)
//登录
router.post('/login', userhandle.login)
// 获取商品
router.get('/trade', userhandle.trade)
// 购买
router.post('/buy', userhandle.buy)
// 撤销商品
router.post('/cancle', userhandle.cancle)
// 发布商品
router.post('/publish', userhandle.publish)
// 查询当前库存
router.get('/repertory', userhandle.repertory)
// 查询我的购买记录
router.get('/myOrder', userhandle.myOrder)
// 获取好友列表
router.get('/getFriend', userhandle.getFriend)
// 加好友
router.post('/addFriend', userhandle.addFriend)
// 加好友/申请
router.get('/userInfo', userhandle.userInfo)
// 删除好友/申请
router.post('/cancleFriend', userhandle.cancleFriend)
// 获取聊天记录
router.get('/getHistory', userhandle.getHistory)
//修改聊天记录
router.post('/addHistory', userhandle.addHistory)





module.exports = router