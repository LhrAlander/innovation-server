const db = require('./DBHelper')

let queryPromise = function (sql, values) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject({
          code: 0,
          msg: '连接数据库失败',
          err: err
        })
      }
      else {
        connection.query(sql, values, (err, results) => {
          if (err) {
            connection.release()
            reject({
              code: 0,
              msg: '操作数据库失败',
              results: err
            })
          }
          else {
            connection.release()
            resolve({
              code: 200,
              msg: '操作数据库成功',
              data: results
            })
          }
        })
      }
    })
  })
}


let queryUtil = {
  queryPromise
}
module.exports = queryUtil
