const db = require('../utils/DBHelper')
const queryHelper = require('../utils/DBQuery')

// 获取信息数量
let getCount = filter => {
  let sql = `select count(*) as number from(select user_id as username,user_name as name,user_identity as role,account_state as status,user_phone as phone,user_mail as email from user) as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql, null)
}

// 获取所有用户
let getUsers = function (pageNum, pageSize, filter) {
  const sql = `select * from (select user_id as username,user_name as name,user_identity as role,account_state as status,user_phone as phone,user_mail as email from user order by status desc) as t ${filter ? 'where ' + filter : '' } limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql)
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

// 注册用户
let regUser = u => {
  const sql = `insert into user set ?`
  return queryHelper.queryPromise(sql, u)
}

let userDao = {
  getCount,
  createUser,
  changeUserInfo,
  getUsers,
  searchUser,
  regUser
}
module.exports = userDao