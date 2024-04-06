const defaultImg = require('../assest/index')
//导入数据库
const db = require('../db/sql.js')
//导入token包
const jwt = require('jsonwebtoken')
//全局配置文件
const config = require('../config')



const fs = require('fs')



exports.register = (req, res) => {

    const userInfo = req.body
    console.log(userInfo);
    const { password: { _value: password }, nickname: { _value: nickname }, account: { _value: account } } = userInfo
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
    console.log(userInfo);
    const { password: { _value: password }, account: { _value: account } } = userInfo
    console.log(password, account);
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
                    user: { id: user.id, user_pic: user.user_pic, nickname: user.nickname }
                })
            }
        }
    })

}


exports.trade = (req, res) => {
    // res.send('123')
    const sqlstr = 'select * from trade where status = 0'
    db.query(sqlstr, function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            res.send({ data: results, status: 0, message: '获取成功' })
        }
    })
}

