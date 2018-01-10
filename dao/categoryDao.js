const queryHelper = require('../utils/DBQuery')

// 获取所有用户类别
let getAllUserCategories = () => {
  const sql = 'select * from user_identity'
  return queryHelper.queryPromise(sql, null)
}

// 增加用户类别
let addUserCategory = categories => {
  let str = ''
  for (let i = 0; i < categories.length; i++) {
    console.log(categories[i])
    str += `('${categories[i]}')`
    if (i < categories.length - 1)
      str += ','
  }
  const sql = 'insert into user_identity values' + str
  console.log(sql)
  return queryHelper.queryPromise(sql, null)
}

// 删除用户类别
let deleteUserCategory = categories => {
  let str = ''
  let values = []
  for (let i = 0; i < categories.length; i++) {
    if (i > 0) {
      str += '||'
    }
    str += 'user_identity_name = ? '
    values.push(categories[i])
  }
  const sql = 'delete from user_identity where ' + str
  console.log(sql)
  return queryHelper.queryPromise(sql, values)
}

let dao = {
  getAllUserCategories,
  addUserCategory,
  deleteUserCategory
}

module.exports = dao