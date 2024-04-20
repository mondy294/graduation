const defaultImg = require('../assest/index')
//导入数据库
const db = require('../db/sql.js')
//导入token包
const jwt = require('jsonwebtoken')
//全局配置文件
const config = require('../config')

const EditRepertory = require('./utils.js').EditRepertory



const fs = require('fs')



exports.register = (req, res) => {

    const userInfo = req.body
    const { password, nickname, account } = userInfo
    let sql = "select * from user where account=?"
    db.query(sql, [account], function (err, results) {
        //如果查询失败
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            //如果用户名被占用
            if (results.length > 0) {
                return res.send({ status: 1, message: '用户名已被占用' })
            }
            else {
                //插入新用户的数据
                const user = { account: account, password: password, nickname: nickname, user_pic: 'default.jpg' }
                let sql = 'insert into user (account,password,nickname,user_pic) values(?,?,?,?)'
                db.query(sql, [user.account, user.password, user.nickname, user.user_pic], function (err, results) {
                    if (err || results.affectedRows !== 1) {
                        return res.send({ status: 1, message: err.message })
                    }
                    else {
                        res.send({ status: 0, message: '注册成功' })
                    }

                })
            }
        }
    })

}
exports.login = (req, res) => {

    const userInfo = req.body
    const { password, account } = userInfo
    const sqlstr = 'select * from user where account=?'
    db.query(sqlstr, account, function (err, results) {
        if (err || results.length !== 1) {
            return res.send({ status: 1, message: '账号错误 未注册？' })
        }
        else {
            if (!(password == results[0].password)) {
                return res.send({ status: 1, message: '密码错误' })
            }
            else {
                // return res.send('登陆成功')JWT身份验证
                const useri = { ...results[0], password: '', user_pic: '' }
                const user = { ...results[0] }
                //生成token字符串
                const tokenStr = jwt.sign(useri, config.jwtSecretKey, { expiresIn: config.expiresIn })
                res.send({
                    status: 0,
                    message: '登陆成功',
                    token: 'Bearer ' + tokenStr,
                    user: { id: user.id, user_pic: user.user_pic, nickname: user.nickname, repertory: user.repertory, authority: user.authority }
                })
            }
        }
    })

}
exports.trade = (req, res) => {
    const { id, page } = req.query
    if (!id) {
        const sqlstr = 'select * from trade '
        db.query(sqlstr, function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                res.send({ data: results, status: 0, message: '获取成功' })
            }
        })
    }
    // 如果是交易中心页面发来的请求
    if (page == 'trade') {
        const sqlstr = 'select * from trade where sellid!=?'
        db.query(sqlstr, id, function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                res.send({ data: results, status: 0, message: '获取成功' })
            }
        })
    }
    if (page == 'products') {
        const sqlstr = 'select * from trade where sellid=?'
        db.query(sqlstr, id, function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                res.send({ data: results, status: 0, message: '获取成功' })
            }
        })
    }

}

exports.buy = (req, res) => {
    // 者里需要查询一次当前商品的剩余量 确保数据的一致性
    const info = req.body
    const { id, remain, sellid, seller, buyid, buyer, count, totalmoney, repertory, orderid, price, date } = info
    const sqlstr = 'update trade set remain = ? where id=?'
    db.query(sqlstr, [remain, id], function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            // 往已完成的订单列表中新增订单
            let sqlstr = 'insert into orderlist (orderid,sellid,seller,buyid,buyer,count,totalmoney,price,date) values(?,?,?,?,?,?,?,?,?)'
            db.query(sqlstr, [orderid, sellid, seller, buyid, buyer, count, totalmoney, price, date], function (err, results) {
                if (err) {
                    return res.send({ status: 1, message: err.message })
                }
                else {
                    // 更新买家的库存
                    let sqlstr = 'update user set repertory = ? where id=?'
                    db.query(sqlstr, [repertory, buyid], function (err, results) {
                        if (err) {
                            return res.send({ status: 1, message: err.message })
                        }
                        else {
                            res.send({ status: 0, message: '操作成功' })
                        }
                    })
                }
            })
        }
    })
}

exports.cancle = (req, res) => {
    const { idList, repertory, sellid } = req.body
    let sqlstr = 'delete from trade where id = ?'
    for (let i = 0; i < idList.length; i++) {
        db.query(sqlstr, idList[i], function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                // 返还库存
                res.send({ status: 0, message: '删除成功' })
            }
        })
    }
    EditRepertory(repertory, sellid, res)
}

exports.publish = (req, res) => {
    const data = req.body
    const params = Object.values(data)
    const { sellid } = data
    const repertory = params.pop()
    // 发布商品
    const sqlstr = 'insert into trade ( sellid, seller, date, price, count, remain ) values(?,?,?,?,?,?)'
    db.query(sqlstr, params, function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            // 更改库存
            EditRepertory(repertory, sellid, res, '发布成功')
        }
    })
}

// 查询当前库存
exports.repertory = (req, res) => {
    const { id } = req.query
    const sqlstr = 'select * from user where id= ?'
    db.query(sqlstr, id, function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            // 更改库存
            res.send({ data: results, status: 0 })
        }
    })
}

// 查询我的订单
exports.myOrder = (req, res) => {
    const { buyid, sellid } = req.query
    if (buyid) {
        const sqlstr = 'select * from orderlist where buyid= ?'
        db.query(sqlstr, buyid, function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                // 更改库存
                res.send({ data: results, status: 0 })
            }
        })
    }
    else if (sellid) {
        const sqlstr = 'select * from orderlist where sellid= ?'
        db.query(sqlstr, sellid, function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                // 更改库存
                res.send({ data: results, status: 0 })
            }
        })
    }
    else {

        const sqlstr = 'select * from orderlist'
        db.query(sqlstr, function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                // 更改库存
                res.send({ data: results, status: 0 })
            }
        })
    }


}
// 查询商品购买详情
exports.orderDetails = (req, res) => {
    const { orderId } = req.query
    const sqlstr = 'select * from orderlist where orderid= ?'
    db.query(sqlstr, orderId, function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            // 更改库存
            res.send({ data: results, status: 0 })
        }
    })
}

// 加好友
exports.addFriend = (req, res) => {
    let { friends, id, type, targetId } = req.body
    friends = JSON.stringify({ friends: friends })
    if (type == 0) {
        const sqlstr = 'update user set prefriends = ? where id=?'
        db.query(sqlstr, [friends, id], function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                // 更改库存
                res.send({ data: results, status: 0 })
            }
        })
    }
    else {

        const sqlstr = 'update user set friends = ? where id=?'
        db.query(sqlstr, [friends, id], function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                // 更改库存
                res.send({ data: results, status: 0 })
            }
        })
    }

}
// 获取好友列表
exports.getFriend = (req, res) => {
    const { id } = req.query
    const sqlstr = 'select  * from user where id = ?'

    db.query(sqlstr, id, function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            // 如果还没有好友
            if (!results[0].friends) {
                res.send({ data: [], status: 0 })
                return
            }
            let friendStr = ''
            const friends = JSON.parse(results[0].friends).friends
            friends.forEach((item) => {
                friendStr += item + ','
            })
            friendStr = friendStr.substring(0, friendStr.length - 1)
            const sqlstr = `select  * from user where id in (${friendStr})`
            db.query(sqlstr, function (err, results) {
                if (err) {
                    return res.send({ status: 1, message: err.message })
                }
                else {
                    // 更改库存
                    res.send({ data: results, status: 0 })
                }
            })
        }
    })

}
// 获取用户信息
exports.userInfo = (req, res) => {
    const { id } = req.query
    if (id) {
        let friendStr = ''
        // 允许一次查询多个
        const friends = Array.isArray(id) ? id : [id]
        friends.forEach((item) => {
            friendStr += item + ','
        })
        friendStr = friendStr.substring(0, friendStr.length - 1)
        const sqlstr = `select  * from user where id in (${friendStr})`
        db.query(sqlstr, id, function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                if (results.length > 1) {
                    res.send({ data: results, status: 0 })
                }
                else {
                    res.send({ data: results[0], status: 0 })
                }

            }
        })
    }
    else {
        const sqlstr = `select  * from user`
        db.query(sqlstr, function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                res.send({ data: results, status: 0 })
            }
        })
    }

}

// 删除好友或者好友申请
exports.cancleFriend = (req, res) => {
    // 要删除的id
    let { friends, id } = req.body
    // 如果时空数组
    if (!friends) friends = []
    friends = JSON.stringify({ friends: friends })
    const sqlstr = 'update user set prefriends = ? where id=?'
    db.query(sqlstr, [friends, id], function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            // 更改库存
            res.send({ data: results, status: 0 })
        }
    })
}

// 获取聊天记录
exports.getHistory = (req, res) => {
    const { id } = req.query
    const sqlstr = 'select * from history where room =?'
    db.query(sqlstr, id, function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            // 更改库存
            res.send({ data: results[0], status: 0 })
        }
    })
}
// 更新聊天记录
exports.addHistory = (req, res) => {
    const { id, text } = req.body
    let textHistory = []
    const sqlstr = 'select * from history where room =?'
    db.query(sqlstr, id, function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            // 没有过来哦聊记录
            if (!results[0]) {
                textHistory.push(text)
                textHistory = JSON.stringify(textHistory)

                const sqlstr = 'insert into history (textHistory,room) values(?,?)'
                db.query(sqlstr, [textHistory, id], function (err, results) {
                    if (err) {
                        return res.send({ status: 1, message: err.message })
                    }
                    else {
                        // 更改库存
                        res.send({ data: results, status: 0 })
                    }
                })
            } else {
                textHistory = JSON.parse(results[0].textHistory)
                textHistory.push(text)

                textHistory = JSON.stringify(textHistory)

                const sqlstr = 'update history set textHistory = ? where room=?'
                db.query(sqlstr, [textHistory, id], function (err, results) {
                    if (err) {
                        return res.send({ status: 1, message: err.message })
                    }
                    else {
                        // 更改库存
                        res.send({ data: results, status: 0 })
                    }
                })
            }
        }
    })
}

// 查询契约
exports.getContract = (req, res) => {
    const { id } = req.query
    const sqlstr = `select * from contract where sellid =${id} or buyid=${id}`
    db.query(sqlstr, id, function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {

            res.send({ data: results, status: 0 })
        }
    })
}
// 新增/修改  契约
exports.addContract = (req, res) => {
    const { id, count, sellid, buyid, date, content, seller, buyer, status } = req.body
    // 代表修改状态
    if (!count) {
        const sqlstr = `update contract set status=? where id=?`
        db.query(sqlstr, [status, id], function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {

                res.send({ data: results, status: 0 })
            }
        })
    }
    // 代表新增记录
    else {
        const sqlstr = `insert into contract (sellid,buyid,count,content,date,seller, buyer) values(?,?,?,?,?,?,?)`
        db.query(sqlstr, [sellid, buyid, count, content, date, seller, buyer], function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {

                res.send({ data: results, status: 0 })
            }
        })
    }

}

// 通过契约转让
exports.buyContract = async (req, res) => {
    const { id, count } = req.body
    await EditRepertory(count, id, res)

}
// 修改用户信息
exports.updateUserInfo = (req, res) => {
    const { type } = req.body
    const actions = {
        'cancle': cancle,
        'update': update
    }
    return actions[type](req.body)

    function cancle(obj) {
        const { id } = obj
        const sqlstr = 'delete from user where id=?'
        db.query(sqlstr, id, function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                // 更改库存
                res.send({ data: results, status: 0 })
            }
        })
    }
    function update(obj) {
        const { password, id } = obj
        const sqlstr = 'update user set password = ? where id=?'
        db.query(sqlstr, [password, id], function (err, results) {
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            else {
                // 更改库存
                res.send({ data: results, status: 0 })
            }
        })
    }
}

