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
  const sql = 'select * from (select award.*, user.*, award_user.award_project from award, award_user, user where award.award_id = award_user.award_id and award_user.user_id = user.user_id) t1 left join project on project.project_id = t1.award_project'
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