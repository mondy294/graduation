//导入数据库
const db = require('../db/sql.js')

exports.EditRepertory = (repertory, id, res, message) => {
    let sqlstr = 'update user set repertory = ? where id=?'
    db.query(sqlstr, [repertory, id], function (err, results) {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        else {
            if (message) res.send({ status: 0, message: message })
        }
    })
}