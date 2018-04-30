const queryHelper = require('../../utils/DBQuery')
const getAllTeams = (pageNum, pageSize) => {
  const sql = `select team_id as teamId,team_name as teamName,team_introduction as introduction from team where team_state='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql)
}

const getTeamById = teamId => {
  const sql = `select team_name as teamName,team_introduction as introduction,st.user_name as leaderName,st.user_phone as leaderPhone,th.user_name as teacherName,th.user_phone as teacherPhone from team left join user as st on st.user_id=team.team_principal left join user as th on th.user_id=team.team_teacher where team_id=?`
  return queryHelper.queryPromise(sql, teamId)
}

const getStudentsByTeam = teamId => {
  const sql = 'select user.user_name as userName from team_student left join user on team_student.user_id=user.user_id where team_id=?'
  return queryHelper.queryPromise(sql, teamId)
}

const getSideTeams = () => {
  const sql = `select team_id, team_name from team where team_state='可用' order by team_name limit 0, 4`
  return queryHelper.queryPromise(sql, null)
}


const dao = {
  getAllTeams,
  getTeamById,
  getStudentsByTeam,
  getSideTeams
}
module.exports = dao