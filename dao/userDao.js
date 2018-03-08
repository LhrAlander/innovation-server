const db = require('../utils/DBHelper')
const queryHelper = require('../utils/DBQuery')

// 获取所有用户
let getUsers = function (pageNum, pageSize, filter) {
  if (filter != null) {
    const sql = `select * from user where ${filter} and account_state not like '%删除%' order by user_id limit  ${(pageNum - 1) * pageSize}, ${pageSize}`
    console.log(sql)
    return queryHelper.queryPromise(sql, null)
  }
  else {
    const sql = `select * from user  where account_state not like '%删除%' order by user_id limit ${(pageNum - 1) * pageSize}, ${pageSize}`
    console.log(sql)
    return queryHelper.queryPromise(sql, null)
  }
}

// 新增一个用户
let createUser = async function (user) {
  return new Promise(async (resolve, reject) => {
    await db.getConnection(async (err, connection) => {
      if (err) {
        resolve({
          code: 500,
          msg: '获取数据库链接失败'
        })
      }
      else {
        try {
          await connection.beginTransaction()
          let res1 = await queryHelper.queryPromise('insert into user set ?', user, connection)
          let tableName = null
          switch (user.user_identity) {
            case '教师':
              tableName = 'teacher'
              break;
            case '学生':
              tableName = 'student'
              break;
            case '企业':
              tableName = 'company'
              break;
          }
          let res2 = await queryHelper.queryPromise(`insert into ${tableName} set user_id = ?, user_name = ?`, [user.user_id, user.user_name], connection)
          await connection.commit()
          connection.release()
          resolve({
            code: 200,
            msg: '增加用户信息成功'
          })
        }
        catch (error) {
          console.log('出错了，准备回滚', error)
          await connection.rollback(() => {
            console.log('回滚成功')
            connection.release()
          });
          resolve({
            code: 500,
            msg: '增加用户信息失败'
          })
        }
      }
    })
  })

}

// 更改用户信息
let changeUserInfo = function (user, userId) {
  const sql = 'update user set ? where user_id = ?'
  return queryHelper.queryPromise(sql, [user, userId])
}

// 查找一个用户
let searchUser = function (userId) {
  const sql = 'select * from user where user_id = ? and account_state not like "%删除%"'
  return queryHelper.queryPromise(sql, userId)
}

let userDao = {
  createUser,
  changeUserInfo,
  getUsers,
  searchUser
}
module.exports = userDao