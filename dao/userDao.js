const db = require('../utils/DBHelper')
let createUser =  function (user) {
    return new Promise((resolve, reject) => {
        let returnData
        db.getConnection((err, connection) => {
            if (err) {
                console.log("连接数据库失败")
                console.log(err)
                connection.release()
                reject({
                    code: 0,
                    msg: '连接数据库失败',
                    err: err
                }) 
            }
            else {
                connection.query('insert into user set ?', user, (err, results) => {
                    if (err) {
                        connection.release()
                        reject({
                            code: 0,
                            msg: '数据存储失败',
                            results: err
                        })
                    }
                    else {
                        connection.release()
                        resolve({
                            code: 200,
                            msg: '成功',
                            data: results
                        })
                    }
                })
            }
        })
    })
    
}
let userDao = {
    createUser
}
module.exports = userDao