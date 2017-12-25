const db = require('../utils/DBHelper')
const queryHelper = require('../utils/DBQuery')

// 新增一个用户
let createUser =  function (user) {
    const sql = 'insert into user set ?'
    return queryHelper.queryPromise(sql, user)
}

// 更改用户信息
let changeUserInfo = function (user, userId) {
    const sql = 'update user set ? where user_id = ?'
    return queryHelper.queryPromise(sql, [user, userId])
}

let userDao = {
    createUser,
    changeUserInfo
}
module.exports = userDao