const projectDao = require('../dao/projectDao')
const teacherDao = require('../dao/teacherDao')
const teamDao = require('../dao/teamDao')
const studentDao = require('../dao/studentDao')
const userDao = require('../dao/userDao')
const utils = require('../utils/util')
const countHelper = require('../utils/DBQuery')

// 获取所有项目信息
let getAllProjects = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    let count = await countHelper.getTableCount('project')
    count = count.data[0].number
    let responseData = []
    let project = await projectDao.getAllProjects()
    if (project.code == 200) {
      const projects = project.data
      for (let i = 0; i < projects.length; i++) {
        let tmp = {}
        const project = projects[i]
        const teamId = project.team_id
        let team = await teamDao.getTeam(teamId)
        tmp.projectName = project.project_name
        tmp.projectCategory = project.project_identity
        tmp.projectLevel = project.project_level
        tmp.applyYear = project.register_year
        tmp.startDate = project.start_year
        tmp.finishDate = project.finish_year
        tmp.projectId = project.project_id
        tmp.dependentUnit = team.data[0].team_name
        tmp.beginYear = project.start_year
        tmp.deadlineYear = project.finish_year
        utils.formatDate(['applyYear', 'startDate', 'finishDate', 'beginYear', 'deadlineYear'], [tmp], 'yyyy-MM-dd')
        const teacherId = project.project_teacher
        const studentId = project.project_principal
        let teacher = await teacherDao.getTeacher(teacherId)
        let student = await studentDao.getStudent(studentId)

        if (student.code == 200 && student.data.length > 0) {
          tmp.student = student.data[0]
          tmp.principalName = tmp.student.user_id
        }
        if (teacher.code == 200 && teacher.data.length > 0) {
          tmp.teacher = teacher.data[0]
          tmp.guideTeacher = tmp.teacher.user_name
          tmp.guideTeacherName = tmp.teacher.user_id
        }
        responseData.push(tmp)
      }
      res.send({
        code: 200,
        data: responseData,
        count: count
      })
    }
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 400,
      data: err
    })
  }
}

// 增加项目
let addProject = (req, res, next) => {
  let projectId = utils.getId('project')
  let project = req.body.project
  project.project_id = projectId
  const teacherId = project.project_teacher
  const studentId = project.project_principal
  // 确保提交过来的负责人和指导老师存在
  Promise.all([userDao.searchUser(teacherId), userDao.searchUser(studentId)])
    .then(values => {
      if (values[0].code == 200 && values[0].data.length > 0 && values[1].code == 200 && values[1].data.length > 0) {
        return projectDao.addProject(project)
      }
      else {
        throw new Error('无效负责人或者无效指导老师')
      }
    })
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send({
        code: 500,
        msg: err.msg || err.message
      })
    })
}

// 删除项目
let deleteProject = (req, res, next) => {
  let projectId = req.body.projectId
  let payload = {
    project_status: '不可用'
  }
  projectDao.updateProject(payload, projectId)
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send({
        code: 500,
        msg: err.msg || err.message
      })
    })
}

// 更改项目信息
let changeProject = (req, res, next) => {
  let project = req.body.project
  const projectId = project.project_id
  delete project.project_id
  projectDao.updateProject(project, projectId)
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send({
        code: 500,
        msg: err.msg || err.message
      })
    })
}

// 获取一个项目信息
let getProject = async (req, res, next) => {
  const { projectId } = req.body
  console.log(projectId)
  try {
    const responseData = await projectDao.getProject(projectId)
    res.send(responseData)
  }
  catch (err) {
    console.log(err)
  }
}

// 获取所有的项目成员
let getAllUsers = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    let count = await countHelper.getTableCount('project_student')
    count = count.data[0].number
    let responseData = []
    let users = await projectDao.getAllUsers()
    if (users.code == 200) {
      utils.formatDate(['add_time', 'leave_time'], users.data, 'yyyy-MM-dd')
      users = utils.transformRes(users.data)
      for (let index = 0; index < users.length; index++) {
        let _user = users[index]
        let project = await projectDao.getProject(_user.projectId)
        let user = await userDao.searchUser(_user.userId)
        if (project.code != 200 || project.project == null) {
          throw new Error('不存在该项目')
        }
        if (user.code != 200 || user.data.length <= 0) {
          throw new Error('不存在该用户')
        }
        project = project.project
        user = user.data[0]
        let tmp = {
          id: index + 1,
          projectName: project.projectName,
          userId: user.user_id,
          username: user.user_name,
          contact: user.user_phone,
          joinTime: project.startYear
        }
        responseData.push(tmp)
      }
      console.log(responseData)
      res.send({
        code: 200,
        data: responseData,
        count: count
      })
    }
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 400,
      data: err
    })
  }

}

let controller = {
  getAllProjects,
  addProject,
  deleteProject,
  changeProject,
  getProject,
  getAllUsers
}

module.exports = controller