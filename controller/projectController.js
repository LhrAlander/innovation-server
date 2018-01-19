const projectDao = require('../dao/projectDao')
const teacherDao = require('../dao/teacherDao')
const studentDao = require('../dao/studentDao')
const userDao = require('../dao/userDao')
const utils = require('../utils/util')

// 获取所有项目信息
let getAllProjects = async (req, res, next) => {
  try {
    let responseData = []
    let project = await projectDao.getAllProjects()
    if (project.code == 200) {
      const projects = project.data
      for (let i = 0; i < projects.length; i++) {
        let tmp = {}
        const project = projects[i]
        tmp.name = project.project_name
        tmp.category = project.project_identity
        tmp.level = project.project_level
        tmp.regDate = project.register_year
        tmp.startDate = project.start_year
        tmp.finishDate = project.finish_year
        const teacherId = project.project_teacher
        const studentId = project.project_principal
        teacher = await teacherDao.getTeacher(teacherId)
        student = await studentDao.getStudent(studentId)
        if (student.code == 200) {
          tmp.student = student.data[0]
        }
        if (teacher.code == 200) {
          tmp.teacher = teacher.data[0]
        }
        responseData.push(tmp)
      }
      res.send({
        code: 200,
        data: responseData
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
  let projectId = utils.getProjectId()
  let project = req.body.project
  project.project_id = projectId
  const teacherId = project.project_teacher
  const studentId = project.project_principal
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
  const { projectId } = req
  try {
    let responseData = await projectDao.getProject(projectId)
    
  }
  catch(err) {
    console.log(err)
  }
}

let controller = {
  getAllProjects,
  addProject,
  deleteProject,
  changeProject,
  getProject
}

module.exports = controller