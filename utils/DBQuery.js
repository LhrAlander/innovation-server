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

/**
 * 查询表中记录数量
 * @param {*表名} tableName 
 */
let getTableCount = async (tableName, filter) => {
  if (filter != null) {
    console.log(filter)
    const sql = `select count(*) as number from (select * from ${tableName} where ${filter}) as t`
    console.log(sql)
    return queryPromise(sql, filter)
  }
  else {
    const sql = `select count(*) as number from ${tableName}`
    return queryPromise(sql, null)
  }
}



let queryUtil = {
  queryPromise,
  getTableCount
}
module.exports = queryUtil
