const queryHelper = require('../utils/DBQuery')
const config = require('../config')


/**
 * 获取所有的团队信息
 */
let getAllTeams = () => {
  const teamSql = 'select * from team'
  return queryHelper.queryPromise(teamSql)
}

/**
 * 添加一个团队
 * @param {*团队模型对象} project 
 */
let addTeam = team => {
  const sql = 'insert into team set ?'
  return queryHelper.queryPromise(sql, project)
}

/**
 * 修改一个团队的信息
 * @param {*需要修改的字段值} payload 
 * @param {*需要修改的团队的ID} teamId 
 */
let updateTeam = (payload, teamId) => {
  const sql = 'update team set ? where team_id = ?'
  return queryHelper.queryPromise(sql, [payload, projectId])
}


/**
 * 查找一个团队,包括团队下的项目、负责人、教师
 * @param {*团队的ID} teamId 
 */
let getTeam = async teamId => {
  try {
    const teamSql = 'select * from team where team_id = ?'
    return queryHelper.queryPromise(teamSql, teamId)
  }
  catch (err) {
    console.log('获取一个团队信息失败', err)
  }
}

/**
 * 获取所有的团队成员
 */
let getAllUsers = () => {
  const sql = 'select * from team_student'
  return queryHelper.queryPromise(sql, null)
}



let teamDao = {
  getAllTeams,
  addTeam,
  updateTeam,
  getTeam,
  getAllUsers
}

module.exports = teamDao