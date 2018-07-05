const queryHelper = require('../utils/DBQuery')
const config = require('../config')
const utils = require('../utils/util')
const userDao = require('../dao/userDao')
const studentDao = require('../dao/studentDao')
const teamDao = require('../dao/teamDao')


// 获取信息数量
let getCount = filter => {
  if (filter) {
    let sql = `select count(*) as number from(select project.*, student.user_id as studentId, student.user_name as studentName, teacher.user_id as teacherId, teacher.user_name as teacherName from project left join student on project.project_principal = student.user_id left join teacher on project.project_teacher = teacher.user_id) as t where ${filter} and project_status not like '%删除%'`
    return queryHelper.queryPromise(sql, null)
  }
  else {
    let sql = `select count(*) as number from(select project.*, student.user_id as studentId, student.user_name as studentName, teacher.user_id as teacherId, teacher.user_name as teacherName from project left join student on project.project_principal = student.user_id left join teacher on project.project_teacher = teacher.user_id) as t where project_status not like '%删除%'`
    return queryHelper.queryPromise(sql, null)
  }
}

// 获取信息数量
let getUserCount = filter => {
  if (filter) {
    let sql = `select count(*) as number from(select project.*, student.user_id as studentId, student.user_name as studentName, teacher.user_id as teacherId, teacher.user_name as teacherName from project left join student on project.project_principal = student.user_id left join teacher on project.project_teacher = teacher.user_id) as t where ${filter} and project_status not like '%删除%' and pend_status='已结题'`
    return queryHelper.queryPromise(sql, null)
  }
  else {
    let sql = `select count(*) as number from(select project.*, student.user_id as studentId, student.user_name as studentName, teacher.user_id as teacherId, teacher.user_name as teacherName from project left join student on project.project_principal = student.user_id left join teacher on project.project_teacher = teacher.user_id) as t where project_status not like '%删除%' and pend_status='已结题'`
    return queryHelper.queryPromise(sql, null)
  }
}

/**
 * 获取所有的项目信息
 */
let getAllProjects = (pageNum, pageSize, filter) => {
  const projectSql = `select * from (select project.*, student.user_id as studentId, student.user_name as studentName, teacher.user_id as teacherId, teacher.user_name as teacherName,team.team_name from project left join student on project.project_principal = student.user_id left join teacher on project.project_teacher = teacher.user_id left join team on project.team_id = team.team_id) as t  where ${filter ? filter + ' and ' : ''} project_status not like "%删除%" and pend_status='已结题' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(projectSql)
}

/**
 * 添加一个项目
 * @param {*项目模型对象} project 
 */
let addProject = project => {
  const sql = 'insert into project set ?'
  return queryHelper.queryPromise(sql, project)
}

/**
 * 
 * @param {*项目成员模型对象} user 
 */
let addProjectUser = async user => {
  try {
    console.log(user)
    let checkSql = `select * from project_student where project_id = ? and user_id = ?`
    let values = await queryHelper.queryPromise(checkSql, [user.project_id, user.user_id])
    console.log(values)
    if (values.code == 200 && values.data.length > 0) {
      const sql = `update project_student set is_in_service = 1, leave_time = null, add_time = '${user.add_time}' where project_id = '${user.project_id}' and user_id = '${user.user_id}'`
      return queryHelper.queryPromise(sql)
    }
    else {
      const sql = 'insert into project_student set ?'
      return queryHelper.queryPromise(sql, user)
    }
  }
  catch (err) {
    console.log(err)
  }
}

/**
 * 修改一个项目的信息
 * @param {*需要修改的字段值} payload 
 * @param {*需要修改的项目的ID} projectId 
 */
let updateProject = (payload, projectId) => {
  const sql = 'update project set ? where project_id = ?'
  return queryHelper.queryPromise(sql, [payload, projectId])
}

/**
 * 查找一个项目,包括项目材料附件
 * @param {*项目的ID} projectId 
 */
let getProject = async projectId => {
  try {
    const sql = 'select * from project where project_id = ?'
    const memberSql = `select user.user_id as userId,user.user_name as name,user.user_phone as userPhone from project_student left join user on user.user_id=project_student.user_id where project_id=?`
    let project = await queryHelper.queryPromise(sql, projectId)
    let members = await queryHelper.queryPromise(memberSql, projectId)
    console.log(members)
    if (project.code == 200 && project.data.length > 0) {
      utils.formatDate(['register_year', 'start_year', 'finish_year'], project.data, 'yyyy-MM-dd')
      const studentId = project.data[0].project_principal
      const teacherId = project.data[0].project_teacher
      const teamId = project.data[0].team_id
      let student = await userDao.searchUser(studentId)
      let teacher = await userDao.searchUser(teacherId)
      let _student = await studentDao.getStudent(studentId)
      let team = null
      if (teamId != '无') {
        team = await teamDao.getTeam(teamId)
      }
      console.log(teamId)
      project.data[0].projectPerson = _student.data[0].user_name
      project.data[0].personMajor = _student.data[0].student_major
      project.data[0].personClass = _student.data[0].student_class
      project.data[0].projectDep = teamId != '无' ? team.data[0].team_name : '无'

      const uploadFileSql = 'select * from project_files where project_id = ?'
      let files = await queryHelper.queryPromise(uploadFileSql, projectId)
      let regFiles = []     // 项目申请材料
      let finishFiles = []  // 项目结题材料
      let midFiles = []  // 项目中期材料
      if (files.code == 200) {
        files = files.data
        files.forEach(file => {
          if (file.file_type == config.projectFile.REG_FILE) {
            regFiles.push(JSON.parse(JSON.stringify(file)))
          }
          else if (file.file_type == config.projectFile.FINISH_FILE) {
            finishFiles.push(JSON.parse(JSON.stringify(file)))
          }
          else {
            midFiles.push(JSON.parse(JSON.stringify(file)))
          }
        })
      }
      project.data = utils.transformRes(project.data)
      project.data[0].projectTeacher = teacher.data[0].user_name
      regFiles = utils.transformRes(regFiles)
      finishFiles = utils.transformRes(finishFiles)
      midFiles = utils.transformRes(midFiles)
      console.log(regFiles, finishFiles)
      return {
        code: 200,
        project: project.data[0],
        regFile: regFiles,
        finishFile: finishFiles,
        midFile: midFiles,
        leader: {
          userId: student.data[0].user_id,
          name: student.data[0].user_name,
          userPhone: student.data[0].user_phone,
        },
        teacher: {
          userId: teacher.data[0].user_id,
          name: teacher.data[0].user_name,
          userPhone: teacher.data[0].user_phone,
        },
        members: members.data
      }
    }
    else {
      throw new Error('不存在该项目!')
    }
  }
  catch (err) {
    console.log(err)
    return {
      code: 500,
      msg: err.msg || err.message
    }
  }
}

/**
 * 获取所有的项目成员
 */
let getAllUsers = (pageNum, pageSize, filter) => {
  const sql = `select * from (select p.team_id as teamId, p.project_name as projectName,p.project_id as projectId, u.user_id as userId,u.user_name as username, u.user_phone as contact, st.add_time as joinTime from project_student as st left join project as p on st.project_id = p.project_id left join user as u on u.user_id = st.user_id where st.is_in_service='1') as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql, null)
}

/**
 * 查找一个团队下的所有项目
 * @param {*团队Id} teamId 
 */
let getProjectsByTeam = teamId => {
  try {
    const sql = 'select project_name, project_id from project where team_id = ? and project_status="可用" and pend_status="已结题"'
    return queryHelper.queryPromise(sql, teamId)
  }
  catch (err) {
    console.log('根据团查找项目失败', err)
  }
}

/**
 * 上传项目材料
 * @param {*文件对象} file 
 */
let uploadFile = file => {
  try {
    const sql = `insert into project_files set ?`
    return queryHelper.queryPromise(sql, file)
  }
  catch (err) {
    console.log('上传项目材料失败', err)
  }
}

/**
 * 删除文件信息
 * @param {*文件对象} files 
 */
let deleteFile = path => {
  const sql = `delete from project_files where file_path = ?`
  return queryHelper.queryPromise(sql, path)
}

let delProjectUser = user => {
  if (user.del) {
    const sql = `delete from project_student where project_id = '${user.projectId}' and user_id = '${user.userId}'`
    console.log(sql)
    return queryHelper.queryPromise(sql, [user.projectId, user.userId])
  }
  else {
    const sql = `update project_student set is_in_service = 0, leave_time = ? where project_id = ? and user_id = ?`
    console.log(sql)
    return queryHelper.queryPromise(sql, [user.leaveTime, user.projectId, user.userId])
  }
}


// 学生项目数目
let studentProjectCount = (userId, filter) => {
  const sql = `select count(*) as number from (select p.team_id, register_year, start_year, finish_year,p.project_level,p.project_identity,p.project_teacher as teacherId,p.project_principal as studentName, p.project_id as projectId,p.project_name as projectName,p.project_identity as projectCategory,p.project_level as projectLevel,user.user_name as guideTeacher from project as p left join user on p.project_teacher=user.user_id left join project_student on project_student.project_id=p.project_id left join team on team.team_id=p.team_id where project_student.user_id='${userId}' and p.project_status='可用') as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}

// 为学生查询项目
let getProjectsByStudent = (userId, pageNum, pageSize, filter) => {
  const sql = `select * from (select p.team_id, register_year, start_year, finish_year,p.project_principal as studentName,p.project_teacher as teacherId,p.project_identity,p.project_level, p.project_id as projectId,p.project_name as projectName,p.project_identity as projectCategory,p.project_level as projectLevel,user.user_name as guideTeacher from project as p left join user on p.project_teacher=user.user_id left join project_student on project_student.project_id=p.project_id left join team on team.team_id=p.team_id where project_student.user_id='${userId}' and p.project_status='可用') as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql)
}

// 教师项目数目
let teacherProjectCount = (userId, filter) => {
  const sql = `select count(*) as number from (select register_year, start_year, finish_year, team.team_id as teamId,team.team_name as dependentUnit,p.register_year as applyYear,teacher.user_id as guideTeacherName,teacher.user_name as guideTeacher,p.project_id as projectId,p.project_principal as principalName,p.finish_year as deadlineYear,p.project_name as projectName,p.project_identity as projectCategory,p.start_year as beginYear, p.project_level as projectLevel from project as p left join teacher on p.project_teacher=teacher.user_id left join team on team.team_id=p.team_id where p.project_teacher='${userId}' and p.project_status='可用') as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}

// 为教师查询项目
let getProjectsByTeacher = (userId, pageNum, pageSize, filter) => {
  const sql = `select * from (select team.team_id as teamId,team.team_name as dependentUnit,p.register_year as applyYear,teacher.user_id as guideTeacherName,teacher.user_name as guideTeacher,p.project_id as projectId,p.project_principal as principalName,p.finish_year as deadlineYear,p.project_name as projectName,p.project_identity as projectCategory,p.start_year as beginYear, p.project_level as projectLevel from project as p left join teacher on p.project_teacher=teacher.user_id left join team on team.team_id=p.team_id where p.project_teacher='${userId}' and p.project_status='可用') as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql)
}

// 获取项目展开信息
let getExpandInfoById = projectId => {
  const sql = `select p.register_year as applyYear,p.start_year as beginYear,p.finish_year as deadlineYear,p.project_principal as principalName,p.project_teacher as guideTeacherName,team.team_name as dependentUnit from project as p left join team on p.team_id=team.team_id where p.project_id='${projectId}'`
  return queryHelper.queryPromise(sql)
}

// 学生项目成员数目
let studentProjectUserCount = (userId, filter) => {
  const sql = `select count(*) as number from (select t.projectName,t.PID as projectId, user.user_id as userId,user.user_name as username,user.user_phone as contact,project_student.add_time as joinTime from project_student right join (select project.project_id as PID,project.project_name as projectName from project_student left join project on project.project_id=project_student.project_id where user_id='${userId}' and project.project_status='可用') as t on project_student.project_id=t.PID left join user on project_student.user_id=user.user_id) as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}

// 为学生查询项目成员
let getProjectUsersByStudent = (userId, pageNum, pageSize, filter) => {
  const sql = `select * from (select t.teamId, t.projectName,t.leaderId,t.PID as projectId, user.user_id as userId,user.user_name as username,user.user_phone as contact,project_student.add_time as joinTime from project_student right join (select project.team_id as teamId, project.project_id as PID,project.project_principal as leaderId,project.project_name as projectName from project_student left join project on project.project_id=project_student.project_id where user_id='${userId}' and project.project_status='可用') as t on project_student.project_id=t.PID left join user on project_student.user_id=user.user_id) as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

// 教师项目成员数目
let teacherProjectUserCount = (userId, filter) => {
  const sql = `select count(*) as number from (select t.projectName,t.leaderId,t.PID as projectId,user.user_name as username,user.user_id as userId,user.user_phone as contact,project_student.add_time as joinTime from project_student right join (select project_id as PID,project_principal as leaderId,project_name as projectName from project where project_teacher='${userId}' and project.project_status='可用') as t on project_student.project_id=t.PID left join user on project_student.user_id=user.user_id) as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}

// 为教师查询项目成员
let getProjectUsersByTeacher = (userId, pageNum, pageSize, filter) => {
  const sql = `select * from (select t.teamId, t.projectName,t.leaderId,t.PID as projectId,user.user_name as username,user.user_id as userId,user.user_phone as contact,project_student.add_time as joinTime from project_student right join (select team_id as teamId, project_id as PID,project_principal as leaderId,project_name as projectName from project where project_teacher='${userId}' and project.project_status='可用') as t on project_student.project_id=t.PID left join user on project_student.user_id=user.user_id where project_student.is_in_service=1) as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

let getPendProjectsCount = filter => {
  const sql = `select count(*) as number from pend_project  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}

let getAllPendProjects = (filter, pageNum, pageSize) => {
  const sql = `select * from pend_project  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

let addPendProject = project => {
  const sql = `insert into pend_project set ?`
  return queryHelper.queryPromise(sql, project)
}

let changePendProject = (id, info) => {
  const sql = `update pend_project set ? where id = ?`
  return queryHelper.queryPromise(sql, [info, id])
}

let uploadPendProjectFiles = file => {
  const sql = `insert into pend_project_files set ?`
  return queryHelper.queryPromise(sql, file)
}

let getPendProject = id => {
  const sql = `select * from pend_project where id = ?`
  return queryHelper.queryPromise(sql, id)
}

let getPendProjectFilesById = id => {
  const sql = `select * from pend_project_files where project_id = ?`
  return queryHelper.queryPromise(sql, id)
}

let deletePendProjectFile = path => {
  const sql = `delete from pend_project_files where file_path = ?`
  return queryHelper.queryPromise(sql, path)
}

// 学生待审项目数目
let studentPendProjectCount = (userId, filter) => {
  const sql = `select count(*) as number from (select p.pend_status, p.team_id, register_year, start_year, finish_year,p.project_level,p.project_identity,p.project_teacher as teacherId,p.project_principal as studentName, p.project_id as projectId,p.project_name as projectName,p.project_identity as projectCategory,p.project_level as projectLevel,user.user_name as guideTeacher from project as p left join user on p.project_teacher=user.user_id left join project_student on project_student.project_id=p.project_id left join team on team.team_id=p.team_id where project_student.user_id='${userId}' and p.pend_status!='已结题') as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}

// 为学生查询待审项目
let getPendProjectsByStudent = (userId, pageNum, pageSize, filter) => {
  const sql = `select * from (select p.team_id,pend_status, register_year, start_year, finish_year,p.project_principal as studentName,p.project_teacher as teacherId,p.project_identity,p.project_level, p.project_id as projectId,p.project_name as projectName,p.project_identity as projectCategory,p.project_level as projectLevel,user.user_name as guideTeacher from project as p left join user on p.project_teacher=user.user_id left join project_student on project_student.project_id=p.project_id left join team on team.team_id=p.team_id where project_student.user_id='${userId}' and p.pend_status!='已结题') as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql)
}

// 查询所有待审项目
const getUnPended = (pageNum, pageSize, filter) => {
  const projectSql = `select * from (select project.*, student.user_id as studentId, student.user_name as studentName, teacher.user_id as teacherId, teacher.user_name as teacherName,team.team_name from project left join student on project.project_principal = student.user_id left join teacher on project.project_teacher = teacher.user_id left join team on project.team_id = team.team_id) as t  where ${filter ? filter + ' and ' : ''} project_status not like "%删除%" and pend_status!='已结题' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(projectSql)
  return queryHelper.queryPromise(projectSql)
}

// 所有待审项目条数
const getUnPendedCount = filter => {
  const sql = `select count(*) as number from (select project.*, student.user_id as studentId, student.user_name as studentName, teacher.user_id as teacherId, teacher.user_name as teacherName,team.team_name from project left join student on project.project_principal = student.user_id left join teacher on project.project_teacher = teacher.user_id left join team on project.team_id = team.team_id) as t where ${filter ? filter + ' and ' : ''} project_status not like "%删除%" and pend_status!='已结题'`
  return queryHelper.queryPromise(sql)
}

let dao = {
  addProjectUser,
  getCount,
  getAllProjects,
  addProject,
  updateProject,
  getProject,
  getAllUsers,
  getProjectsByTeam,
  uploadFile,
  deleteFile,
  delProjectUser,
  getProjectsByStudent,
  getProjectUsersByStudent,
  studentProjectUserCount,
  studentProjectCount,
  getProjectUsersByTeacher,
  getProjectsByTeacher,
  teacherProjectUserCount,
  teacherProjectCount,
  getExpandInfoById,
  getAllPendProjects,
  getPendProjectsCount,
  addPendProject,
  changePendProject,
  uploadPendProjectFiles,
  getPendProject,
  getPendProjectFilesById,
  deletePendProjectFile,
  studentPendProjectCount,
  getPendProjectsByStudent,
  getUnPended,
  getUnPendedCount
}

module.exports = dao