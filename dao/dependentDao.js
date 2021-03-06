const queryHelper = require('../utils/DBQuery')
const config = require('../config')

// 获取信息数量
let getCount = filter => {
  let sql = `select count(*) as number from(select unit.unit_name as unitName,unit.unit_identity as unitCategory,unit.unit_address as address,user.user_name as leader,user.user_phone as leaderPhone,user.user_mail as email,user.user_id as leaderId from dependent_unit as unit left join user on unit.unit_principal=user.user_id) as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql, null)
}

/**
 * 获取所有的依托单位信息
 */
let getAllDependents = (pageNum, pageSize, filter) => {
  let sql = 'select * from dependent_unit'
  if (pageNum != null) {
    sql = `select * from (select unit.unit_state as status,unit.unit_id as unitId,unit.unit_name as unitName,unit.unit_identity as unitCategory,unit.unit_address as address,user.user_name as leader,user.user_phone as leaderPhone,user.user_mail as email,user.user_id as leaderId from dependent_unit as unit left join user on unit.unit_principal=user.user_id) as t ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  }
  console.log(sql)
  return queryHelper.queryPromise(sql, null)
}

/**
 * 获取所有依托单位的名字
 */


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

/**
 * 教师依托单位数量
 * @param {*教师工号} userId 
 * @param {*匹配条件} filter 
 */
const teacherUnitCount = (userId, filter) => {
  const sql = `select count(*) as number from (select unit.unit_address as address,unit.unit_id as unitId,unit.unit_name as unitName, unit.unit_identity as unitCategory, user.user_id as leaderId,user.user_name as leader,user.user_mail as email, user.user_phone as leaderPhone from dependent_unit as unit left join user on user.user_id=unit.unit_principal where unit.unit_principal='${userId}') as t ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}


/**
 * 为教师查询依托单位
 * @param {*教师工号} userId 
 */
const getUnitsByTeacher = (userId, pageNum, pageSize, filter) => {
  const sql = `select * from (select unit.unit_address as address,unit.unit_id as unitId,unit.unit_name as unitName, unit.unit_identity as unitCategory, user.user_id as leaderId,user.user_name as leader,user.user_mail as email, user.user_phone as leaderPhone from dependent_unit as unit left join user on user.user_id=unit.unit_principal where unit.unit_principal='${userId}') as t ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const getLeaderChoices = () => {
  const sql = `select user_name, user_id, user_phone from user where user_identity='企业' order by user_name`
  return queryHelper.queryPromise(sql)
}

let dao = {
  getCount,
  getAllDependents,
  updateDependent,
  addDependent,
  getDependent,
  teacherUnitCount,
  getUnitsByTeacher,
  getLeaderChoices
}
module.exports = dao