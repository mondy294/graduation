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



module.exports = router