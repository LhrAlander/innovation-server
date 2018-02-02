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

let getAllUsers = () => {
  const sql = 'select * from award_user'
  return queryHelper.queryPromise(sql, null)
}
 
let awardDao = {
  getAllAwards,
  updateAward,
  addAward,
  deleteAward,
  getAllUsers
}

module.exports = awardDao