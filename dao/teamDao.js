const queryHelper = require('../utils/DBQuery')
const config = require('../config')

// 获取信息数量
let getCount = filter => {
  let sql = `select count(*) as number from(select t.team_id as teamId,t.team_name as groupName,st.user_id as leaderId,st.user_name as leaderName,st.user_phone as leaderPhone,teacher.user_name as teacher,teacher.user_id as teacherId,teacher.user_phone teacherPhone,unit.unit_name as dependentUnit,unit.unit_id as unitId from team as t left join user as st on t.team_principal=st.user_id left join user as teacher on t.team_teacher=teacher.user_id left join dependent_unit as unit on t.team_dependent_unit=unit.unit_id where team_state not like '%删除%') as t ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql, null)
}

/**
 * 获取所有的团队信息
 */
let getAllTeams = (pageNum, pageSize, filter) => {
  const teamSql = `select * from (select t.team_id as teamId,t.team_name as groupName,st.user_id as leaderId,st.user_name as leaderName,st.user_phone as leaderPhone,teacher.user_name as teacher,teacher.user_id as teacherId,teacher.user_phone teacherPhone,unit.unit_name as dependentUnit,unit.unit_id as unitId from team as t left join user as st on t.team_principal=st.user_id left join user as teacher on t.team_teacher=teacher.user_id left join dependent_unit as unit on t.team_dependent_unit=unit.unit_id where team_state not like '%删除%') as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize} `
  console.log(teamSql)
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
  return queryHelper.queryPromise(sql, [payload, teamId])
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
  const sql = `select team.team_name,user.user_id, user.user_name, user.user_phone, team_student.add_time from team_student left join team on team.team_id = team_student.team_id left join user on team_student.user_id = user.user_id where team_student.is_in_service = 1`
  return queryHelper.queryPromise(sql, null)
}


/**
 * 查找一个依托单位下的所有团队
 * @param {*依托单位Id} unitId 
 */
let getTeamsByUnit = unitId => {
  try {
    const sql = 'select team_id, team_name from team where team_dependent_unit = ?'
    return queryHelper.queryPromise(sql, unitId)
  }
  catch (err) {
    console.log('根据团查找项目失败', err)
    return null
  }
}


let teamDao = {
  getCount,
  getAllTeams,
  addTeam,
  updateTeam,
  getTeam,
  getAllUsers,
  getTeamsByUnit
}

module.exports = teamDao