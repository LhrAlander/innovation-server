const queryHelper = require('../utils/DBQuery')
const config = require('../config')

/**
 * 获取所有的依托单位信息
 */
let getAllDependents = () => {
  const sql = 'select * from dependent_unit left join user on dependent_unit.unit_principal = user.user_id'
  return queryHelper.queryPromise(sql, null)
}

/**
 * 更新依托单位信息
 * @param {*需要修改的字段} payload 
 * @param {*依托单位Id} unitId 
 */
let updateDependent = (payload, unitId) => {
  const sql = 'update dependent_unit set ? where unit_id = ?'
  return queryHelper.queryPromise(sql, [payload, unitId])
}

/**
 * 添加一个依托单位
 * @param {*依托单位信息} dependent 
 */
let addDependent = dependent => {
  const sql = 'insert into dependent_unit set ?'
  return queryHelper.queryPromise(sql, dependent)
}


/**
 * 查找一个依托单位信息
 * @param {*依托单位Id} unitId 
 */
let getDependent = unitId => {
  const sql = 'select * from dependent_unit where unit_id = ?'
  return queryHelper.queryPromise(sql, unitId)
}

let dao = {
  getAllDependents,
  updateDependent,
  addDependent,
  getDependent
}
module.exports = dao