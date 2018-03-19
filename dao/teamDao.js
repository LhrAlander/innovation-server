const queryHelper = require('../utils/DBQuery')
const config = require('../config')

// 获取信息数量
let getCount = filter => {
  let sql = `select count(*) as number from(select  t.team_state as status,t.team_id as teamId,t.team_name as groupName,st.user_id as leaderId,st.user_name as leaderName,st.user_phone as leaderPhone,teacher.user_name as teacher,teacher.user_id as teacherId,teacher.user_phone teacherPhone,unit.unit_name as dependentUnit,unit.unit_id as unitId from team as t left join user as st on t.team_principal=st.user_id left join user as teacher on t.team_teacher=teacher.user_id left join dependent_unit as unit on t.team_dependent_unit=unit.unit_id where team_state not like '%删除%') as t ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql, null)
}

// 获取信息数量
let getUserCount = filter => {
  const sql = `select count(*) as number from (select t.team_state as status,t.team_name as groupName,t.team_id as teamId,u.user_id as userId,u.user_name as username,u.user_phone as contact,ts.add_time as joinTime from team_student as ts left join team as t on ts.team_id=t.team_id left join user as u on ts.user_id=u.user_id where ts.is_in_service=1) as t  ${filter ? 'where ' + filter : ''} `
  return queryHelper.queryPromise(sql, null)
}


/**
 * 获取所有的团队信息
 */
let getAllTeams = (pageNum, pageSize, filter) => {
  const teamSql = `select * from (select  t.team_state as status,t.team_id as teamId,t.team_name as groupName,st.user_id as leaderId,st.user_name as leaderName,st.user_phone as leaderPhone,teacher.user_name as teacher,teacher.user_id as teacherId,teacher.user_phone teacherPhone,unit.unit_name as dependentUnit,unit.unit_id as unitId from team as t left join user as st on t.team_principal=st.user_id left join user as teacher on t.team_teacher=teacher.user_id left join dependent_unit as unit on t.team_dependent_unit=unit.unit_id where team_state not like '%删除%' order by t.team_state desc) as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize} `
  console.log(teamSql)
  return queryHelper.queryPromise(teamSql)
}

/**
 * 添加一个团队
 * @param {*团队模型对象} project 
 */
let addTeam = team => {
  const sql = 'insert into team set ?'
  return queryHelper.queryPromise(sql, team)
}


/**
 * 
 * @param {*团队成员模型对象} user 
 */
let addTeamUser = async user => {
  try {
    console.log(user)
    let checkSql = `select * from team_student where team_id=? and user_id=?`
    let values = await queryHelper.queryPromise(checkSql, [user.team_id, user.user_id])
    if (values.code == 200 && values.data.length > 0) {
      const sql = `update team_student set is_in_service = 1, leave_time = null, add_time = '${user.add_time}' where team_id = '${user.team_id}' and user_id = '${user.user_id}'`
      return queryHelper.queryPromise(sql)
    }
    else {
      const sql = 'insert into team_student set ?'
      return queryHelper.queryPromise(sql, user)
    }
  } 
  catch (err) {
    console.log(err)
  }
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
let getAllUsers = (pageNum, pageSize, filter) => {
  const sql = `select * from (select t.team_name as groupName,t.team_id as teamId,u.user_id as userId,u.user_name as username,u.user_phone as contact,ts.add_time as joinTime from team_student as ts left join team as t on ts.team_id=t.team_id left join user as u on ts.user_id=u.user_id where ts.is_in_service=1) as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
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

// 删除团队成员
let delTeamUser = user => {
  let sql = `update team_student set is_in_service = 0, leave_time='${user.leave_time}' where team_id='${user.team_id}' and user_id = '${user.user_id}' `
  if (user.del) {
    sql = `delete from team_student where team_id='${user.team_id}' and user_id='${user.user_id}'`
  }
  return queryHelper.queryPromise(sql)
}

// 学生团队数目
let studentTeamCount = (userId, filter) => {
  const sql = `select count(*) as number from (select st.user_name as leaderName,st.student_major as leaderSpecialty,unit.unit_name as dependentUnit,teacher.user_name as teacher,t.team_name as groupName, t.team_principal as leaderId, t.team_id as teamId from team_student as tst left join team as t on tst.team_id=t.team_id left join user as teacher on teacher.user_id=t.team_teacher left join dependent_unit as unit on unit.unit_id=t.team_dependent_unit left join student as st on st.user_id=t.team_principal where tst.user_id='${userId}') as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}

// 为学生查询团队
let getTeamsByStudent = (userId, pageNum, pageSize, filter) => {
  const sql =`select * from (select st.user_name as leaderName,st.student_major as leaderSpecialty,unit.unit_name as dependentUnit,teacher.user_name as teacher,t.team_name as groupName, t.team_principal as leaderId, t.team_id as teamId from team_student as tst left join team as t on tst.team_id=t.team_id left join user as teacher on teacher.user_id=t.team_teacher left join dependent_unit as unit on unit.unit_id=t.team_dependent_unit left join student as st on st.user_id=t.team_principal where tst.user_id='${userId}') as t ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}


// 教师团队数目
let teacherTeamCount = (userId, filter) => {
  const sql = `select count(*) as number from (select st.user_name as leaderName,st.student_major as leaderSpecialty,st.student_class as leaderClass,unit.unit_name as dependentUnit,teacher.user_name as teacher,teacher.user_phone as teacherPhone,teacher.user_id as teacherId,t.team_name as groupName, t.team_principal as leaderId, t.team_id as teamId,stu.user_phone as leaderPhone from team as t left join user as teacher on teacher.user_id=t.team_teacher left join dependent_unit as unit on unit.unit_id=t.team_dependent_unit left join student as st on st.user_id=t.team_principal left join user as stu on stu.user_id = t.team_principal where t.team_teacher='${userId}') as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}

// 为教师查询团队
let getTeamsByTeacher = (userId, pageNum, pageSize, filter) => {
  const sql =`select * from (select st.user_name as leaderName,st.student_major as leaderSpecialty,st.student_class as leaderClass,unit.unit_name as dependentUnit,teacher.user_name as teacher,teacher.user_phone as teacherPhone,teacher.user_id as teacherId,t.team_name as groupName, t.team_principal as leaderId, t.team_id as teamId,stu.user_phone as leaderPhone from team as t left join user as teacher on teacher.user_id=t.team_teacher left join dependent_unit as unit on unit.unit_id=t.team_dependent_unit left join student as st on st.user_id=t.team_principal left join user as stu on stu.user_id = t.team_principal where t.team_teacher='${userId}') as t ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql)
}



// 获取团队展开信息
let getExpandInfoByTeamId = teamId => {
  const sql = `select student.student_class as leaderClass,st.user_phone as leaderPhone,th.user_id as theacherId,th.user_phone as teacherPhone,t.team_principal as leaderId,t.team_teacher as teacherId from team as t left join user as th on t.team_teacher=th.user_id left join student on student.user_id=t.team_principal left join user as st on st.user_id=t.team_principal where t.team_id='${teamId}'`
  return queryHelper.queryPromise(sql)
}

// 学生团队成员数目
let studentTeamUserCount = (userId, filter) => {
  const sql = `select count(*) as number from (select team.team_name as groupName,user.user_id as userId,user.user_name as username,user.user_phone as contact,tst.add_time as joinTime from (select team_id as teamId from team_student where user_id='${userId}') as t left join team_student as tst on t.teamId=tst.team_id left join user on tst.user_id=user.user_id left join team on t.teamId=team.team_id where tst.is_in_service=1) as t ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}

// 为学生查询团队成员
let getTeamUsersByStudent = (userId, pageNum, pageSize, filter) => {
  const sql = `select * from (select team.team_name as groupName,team.team_principal as leaderId,user.user_id as userId,user.user_name as username,user.user_phone as contact,tst.add_time as joinTime from (select team_id as teamId from team_student where user_id='${userId}') as t left join team_student as tst on t.teamId=tst.team_id left join user on tst.user_id=user.user_id left join team on t.teamId=team.team_id where tst.is_in_service=1) as t ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

// 教师团队成员数目
let teacherTeamUserCount = (userId, filter) => {
  const sql = `select count(*) as number from (select team.team_name as groupName,user.user_id as userId,user.user_name as username,user.user_phone as contact,tst.add_time as joinTime from (select team_id as teamId from team where team_teacher='${userId}') as t left join team_student as tst on t.teamId=tst.team_id left join user on tst.user_id=user.user_id left join team on t.teamId=team.team_id where tst.is_in_service=1) as t ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}

// 为教师查询团队成员
let getTeamUsersByTeacher = (userId, pageNum, pageSize, filter) => {
  const sql = `select * from (select team.team_name as groupName,team.team_principal as leaderId,user.user_id as userId,user.user_name as username,user.user_phone as contact,tst.add_time as joinTime from (select team_id as teamId from team where team_teacher='${userId}') as t left join team_student as tst on t.teamId=tst.team_id left join user on tst.user_id=user.user_id left join team on t.teamId=team.team_id where tst.is_in_service=1) as t ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

let teamDao = {
  addTeamUser,
  getCount,
  getUserCount,
  getAllTeams,
  addTeam,
  updateTeam,
  getTeam,
  getAllUsers,
  getTeamsByUnit,
  delTeamUser,
  studentTeamCount,
  getTeamsByStudent,
  getExpandInfoByTeamId,
  studentTeamUserCount,
  getTeamUsersByStudent,
  teacherTeamCount,
  getTeamsByTeacher,
  teacherTeamUserCount,
  getTeamUsersByTeacher,
}

module.exports = teamDao