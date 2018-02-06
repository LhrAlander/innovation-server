const queryHelper = require('../utils/DBQuery')
const config = require('../config')
const utils = require('../utils/util')
const userDao = require('../dao/userDao')
const studentDao = require('../dao/studentDao')
const teamDao = require('../dao/teamDao')
/**
 * 获取所有的项目信息
 */
let getAllProjects = () => {
  const projectSql = 'select * from project'
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
    console.log(project)
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
      return {
        code: 200,
        project: project.data[0],
        regFile: regFiles[0],
        finishFile: finishFiles[0],
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
let getAllUsers = () => {
  const sql = 'select * from project_student'
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


let dao = {
  getAllProjects,
  addProject,
  updateProject,
  getProject,
  getAllUsers,
  getProjectsByTeam
}

module.exports = dao