const queryHelper = require('../utils/DBQuery')

/**
 * 获取所有类别
 * @param {*表名} dbName
 */
let getAllCategories = dbName => {
  console.log(dbName)
  const sql = `select * from ${dbName}`
  return queryHelper.queryPromise(sql, null)
}
/**
 * 增加类别
 * @param {*要增加的类别，数组} categories 
 * @param {*表名} dbName 
 */
let addCategory = (categories, dbName) => {
  console.log(categories, dbName)
  let str = ''
  for (let i = 0; i < categories.length; i++) {
    str += `('${categories[i]}')`
    if (i < categories.length - 1)
      str += ','
  }
  const sql = `insert into ${dbName} values ${str}`
  console.log(sql)
  return queryHelper.queryPromise(sql, null)
}
/**
 * 删除类别
 * @param {*要删除的类别，数组} categories 
 * @param {*表名} dbName 
 * @param {*表中字段名} colName 
 */
let deleteCategory = (categories, dbName, colName) => {
  let str = ``
  let values = []
  for (let i = 0; i < categories.length; i++) {
    if (i > 0) {
      str += `||`
    }
    str += `${colName} = ? `
    values.push(categories[i])
  }
  const sql = `delete from ${dbName} where ${str}`
  return queryHelper.queryPromise(sql, values)
}



let dao = {
  getAllCategories,
  addCategory,
  deleteCategory
}

module.exports = dao