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
    let sql = `select count(*) as number from(select project.*, student.user_id as studentId, student.user_name as studentName, teacher.user_id as teacherId, teacher.user_name as teacherName from project left join student on project.project_principal = student.user_id left join teacher on project.project_teacher = teacher.user_id) as t where ${filter} and project_status not like '%删除%'`
    return queryHelper.queryPromise(sql, null)
  }
  else {
    let sql = `select count(*) as number from(select project.*, student.user_id as studentId, student.user_name as studentName, teacher.user_id as teacherId, teacher.user_name as teacherName from project left join student on project.project_principal = student.user_id left join teacher on project.project_teacher = teacher.user_id) as t where project_status not like '%删除%'`
    return queryHelper.queryPromise(sql, null)
  }
}

/**
 * 获取所有的项目信息
 */
let getAllProjects = (pageNum, pageSize, filter) => {
  const projectSql = `select * from (select project.*, student.user_id as studentId, student.user_name as studentName, teacher.user_id as teacherId, teacher.user_name as teacherName,team.team_name from project left join student on project.project_principal = student.user_id left join teacher on project.project_teacher = teacher.user_id left join team on project.team_id = team.team_id) as t  where ${filter ? filter + ' and ' : ''} project_status not like "%删除%" limit ${(pageNum - 1) * pageSize}, ${pageSize}`
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
    let project = await queryHelper.queryPromise(sql, projectId)
    if (project.code == 200 && project.data.length > 0) {
      utils.formatDate(['register_year', 'start_year', 'finish_year'], project.data, 'yyyy-MM-dd')
      const studentId = project.data[0].project_principal
      const teacherId = project.data[0].project_teacher
      const teamId = project.data[0].team_id
      let student = await userDao.searchUser(studentId)
      let teacher = await userDao.searchUser(teacherId)
      let _student = await studentDao.getStudent(studentId)
      let team = await teamDao.getTeam(teamId)
      project.data[0].projectPerson = _student.data[0].user_name
      project.data[0].personMajor = _student.data[0].student_major
      project.data[0].personClass = _student.data[0].student_class
      project.data[0].projectDep = team.data[0].team_name

      const uploadFileSql = 'select * from project_files where project_id = ?'
      let files = await queryHelper.queryPromise(uploadFileSql, projectId)
      let regFiles = []     // 项目申请材料
      let finishFiles = []  // 项目结题材料
      if (files.code == 200) {
        files = files.data
        files.forEach(file => {
          if (file.file_type == config.projectFile.REG_FILE) {
            regFiles.push(JSON.parse(JSON.stringify(file)))
          }
          else {
            finishFiles.push(JSON.parse(JSON.stringify(file)))
          }
        })
      }
      project.data = utils.transformRes(project.data)
      project.data[0].projectTeacher = teacher.data[0].user_name
      regFiles = utils.transformRes(regFiles)
      finishFiles = utils.transformRes(finishFiles)
      console.log(regFiles, finishFiles)
      return {
        code: 200,
        project: project.data[0],
        regFile: regFiles,
        finishFile: finishFiles,
        leader: {
          userId: student.data[0].user_id,
          name: student.data[0].user_name,
          userPhone: student.data[0].user_phone,
        },
        teacher: {
          userId: teacher.data[0].user_id,
          name: teacher.data[0].user_name,
          userPhone: teacher.data[0].user_phone,
        }
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
  const sql = `select * from (select p.project_name as projectName,p.project_id as projectId, u.user_id as userId,u.user_name as username, u.user_phone as contact, st.add_time as joinTime from project_student as st left join project as p on st.project_id = p.project_id left join user as u on u.user_id = st.user_id where st.is_in_service='1') as t  ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql, null)
}

/**
 * 查找一个团队下的所有项目
 * @param {*团队Id} teamId 
 */
let getProjectsByTeam = teamId => {
  try {
    const sql = 'select project_name, project_id from project where team_id = ?'
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
  delProjectUser
}

module.exports = dao