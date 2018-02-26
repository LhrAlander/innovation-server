const queryHelper = require('../utils/DBQuery')
const config = require('../config')

// 获取信息数量
let getCount = filter => {
  let sql = `select count(*) as number from(select award_id as awardId,award_time as awardTime,award_name as awardName,award_identity as awardLevel,award_level as awardSecondLevel from award) as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql, null)
}

// 获取信息数量
let getUserCount = filter => {
  const sql = `select count(*) as number from (select award.award_name as name,award.award_identity as awardLevel,award.award_level as awardSecondLevel,award_user.award_project as projectId,project.project_name as projectName,user.user_name as username,user.user_phone as contact from award_user left join award on award_user.award_id = award.award_id left join project on award_user.award_project = project.project_id left join user on award_user.user_id = user.user_id) as t  ${filter ? 'where ' + filter : ''} `
  return queryHelper.queryPromise(sql, null)
}

// 获取所有的奖项信息
let getAllAwards = (pageNum, pageSize, filter) => {
  const sql = `select * from (select award_id as awardId,award_time as awardTime,award_name as awardName,award_identity as awardLevel,award_level as awardSecondLevel from award) as t ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

let getAllAwardNames = () => {
  const sql = `select distinct award_name as name from award`
  return queryHelper.queryPromise(sql)
}

/**
 * 修改一个获奖信息
 * @param {*需要修改的字段值} payload 
 * @param {*需要修改的获奖信息的ID} teamId 
 */
let updateAward = (payload, awardId) => {
  const sql = 'update award set ? where award_id = ?'
  return queryHelper.queryPromise(sql, [payload, awardId])
}

// 添加一个获奖信息
let addAward = award => {
  const sql = 'insert into award set ?'
  return queryHelper.queryPromise(sql, award)
}

/**
 * 删除一个获奖信息
 * @param {*获奖信息的Id} awardId 
 */
let deleteAward = awardId => {
  const sql = 'delete from award where award_id = ?'
  return queryHelper.queryPromise(sql, awardId)
}

// 获取所有获奖用户
let getAllUsers = (pageNum, pageSize, filter) => {
  const sql = `select * from (select award.award_name as name,award.award_identity as awardLevel,award.award_level as awardSecondLevel,award_user.award_project as projectId,project.project_name as projectName,user.user_name as username,user.user_phone as contact from award_user left join award on award_user.award_id = award.award_id left join project on award_user.award_project = project.project_id left join user on award_user.user_id = user.user_id) as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql, null)
}

/**
 * 增加一个获奖成员
 * @param {*获奖成员信息} award 
 */
let addUser = award => {
  const sql = 'insert into award_user set ?'
  return queryHelper.queryPromise(sql, award)
}

/**
 * 删除一个获奖成员
 * @param {*获奖信息的Id} awardId 
 * @param {*用户Id} userId 
 */
let deleteUser = (awardId, userId) => {
  const sql = 'delete from award_user where award_id = awardId and user_id = userId'
  return queryHelper.queryPromise(sql, [awardId, userId])
}


let awardDao = {
  getCount,
  getUserCount,
  getAllAwards,
  getAllAwardNames,
  updateAward,
  addAward,
  deleteAward,
  getAllUsers,
  addUser,
  deleteUser
}

module.exports = awardDao