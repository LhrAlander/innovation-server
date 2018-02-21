const queryHelper = require('../utils/DBQuery')
const config = require('../config')

// 获取所有的奖项信息
let getAllAwards = () => {
  const sql = 'select * from award'
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
let getAllUsers = () => {
  const sql = 'select award.award_name, project.project_name, user.user_name, user.user_phone,user.user_id from award_user left join user on user.user_id = award_user.user_id left join project on award_user.award_project = project.project_id left join award on award_user.award_id = award.award_id'
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
  getAllAwards,
  updateAward,
  addAward,
  deleteAward,
  getAllUsers,
  addUser,
  deleteUser
}

module.exports = awardDao