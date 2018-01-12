const projectDao = require('../dao/projectDao')
const teacherDao = require('../dao/teacherDao')
const studentDao = require('../dao/studentDao')
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
  projectDao.addProject(project)
  .then(values => {
    res.send(values)
  })
  .catch(err => {
    res.send(err)
  })
}

let controller = {
  getAllProjects,
  addProject
}

module.exports = controller