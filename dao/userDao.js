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
let createUser = function (user) {
  const sql = 'insert into user set ?'
  return queryHelper.queryPromise(sql, user)
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