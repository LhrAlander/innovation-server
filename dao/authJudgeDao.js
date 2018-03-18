const queryHelper = require('../utils/DBQuery')

// 查询是否具有查看项目信息权限
let judgeProjectInfoByStudent = (userId, projectId) => {
  const sql = `select * from project_student where project_id=? and user_id=?`
  return queryHelper.queryPromise(sql, [projectId, userId])
}

// 查询是否具有修改项目信息权限
let judgeEditProjectInfo = projectId => {
  const sql = `select * from project where project_id=?`
  return queryHelper.queryPromise(sql, projectId)
}

// 查询是否具有查看团队信息的权限
let judgeTeamInfoByStudent = (userId, teamId) => {
  const sql = `select * from team_student where team_id=? and user_id=?`
  return queryHelper.queryPromise(sql, [teamId, userId])
}

// 查询是否具有修改项目信息权限
let judgeEditTeamInfo = teamId => {
  const sql = `select * from team where team_id=?`
  return queryHelper.queryPromise(sql, [teamId])
}

const dao = {
  judgeProjectInfoByStudent,
  judgeEditProjectInfo,
  judgeTeamInfoByStudent,
  judgeEditTeamInfo
}
module.exports = dao