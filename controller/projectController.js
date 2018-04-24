const projectDao = require('../dao/projectDao')
const teamDao = require('../dao/teamDao')
const userDao = require('../dao/userDao')
const utils = require('../utils/util')
const countHelper = require('../utils/DBQuery')

// 获取所有项目信息
let getAllProjects = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await projectDao.getCount(filter)
    count = count.data[0].number
    let responseData = []
    let project = await projectDao.getAllProjects(pageNum, pageSize, filter)
    if (project.code == 200) {
      const projects = project.data
      for (let i = 0; i < projects.length; i++) {
        let tmp = {}
        const project = projects[i]
        tmp.projectName = project.project_name
        tmp.projectCategory = project.project_identity
        tmp.projectLevel = project.project_level
        tmp.applyYear = project.register_year
        tmp.startDate = project.start_year
        tmp.finishDate = project.finish_year
        tmp.projectId = project.project_id
        tmp.dependentUnit = project.team_name
        tmp.beginYear = project.start_year
        tmp.deadlineYear = project.finish_year
        tmp.principalName = project.studentId
        tmp.guideTeacher = project.teacherName
        tmp.guideTeacherName = project.teacherId
        tmp.status = project.project_status
        utils.formatDate(['applyYear', 'startDate', 'finishDate', 'beginYear', 'deadlineYear'], [tmp], 'yyyy-MM-dd')
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
  console.log(project)
  let addTime = new Date()
  addTime = `${addTime.getFullYear()}-${addTime.getMonth() + 1}-${addTime.getDate()}`
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

      return projectDao.addProjectUser({
        project_id: projectId,
        user_id: studentId,
        add_time: addTime,
        is_in_service: 1
      })
    })
    .then(values => {
      return teamDao.addTeamUser({
        team_id: project.team_id,
        user_id: studentId,
        add_time: addTime,
        is_in_service: 1
      })
    })
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      console.log(err)
      res.send({
        code: 500,
        msg: err.msg || err.message
      })
    })
}

// 增加项目成员
let addProjectUser = (req, res, next) => {
  let { user } = req.body
  console.log(user)
  const { project_id, user_id } = user
  let teamId = user.teamId
  delete user.teamId
  Promise.all([userDao.searchUser(user_id), projectDao.getProject(project_id)])
    .then(values => {
      if (values.every((el, index, array) => {
        return el.code == 200
      })) {
        return projectDao.addProjectUser(user)
      }
      else {
        throw new Error('无效用户或者无效项目')
      }
    })
    .then(values => {
      return teamDao.addTeamUser({
        team_id: teamId,
        user_id: user.user_id,
        add_time: user.add_time,
        is_in_service: 1
      })
    })
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      console.log(err)
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
    project_status: req.body.project_status
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
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await countHelper.getTableCount('project_student')
    count = count.data[0].number
    let users = await projectDao.getAllUsers(pageNum, pageSize, filter)
    if (users.code == 200) {
      utils.formatDate(['joinTime'], users.data, 'yyyy-MM-dd')
      users = users.data
      for (let index = 0; index < users.length; index++) {
        users[index].index = index + 1
      }
      res.send({
        code: 200,
        data: users,
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

// 删除项目材料附件
let deleteFiles = async (req, res, next) => {
  let files = req.body.files
  try {
    let rmRes = await utils.rmFile(files)
    for (let i = 0; i < rmRes.length; i++) {
      if (rmRes[i].code == 200) {
        let delRes = await projectDao.deleteFile(rmRes[i].filePath)
        if (delRes.code != 200) {
          throw new Error('删除数据库失败')
        }
      }
    }
    res.send({
      code: 200,
      data: '删除材料成功'
    })
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      data: '删除材料失败'
    })
  }
}

// 删除项目成员
let delProjectUser = async (req, res, next) => {
  try {
    const { user } = req.body
    console.log(user)
    user.leaveTime = new Date().toLocaleDateString()
    let values = await projectDao.delProjectUser(user)
    await teamDao.delTeamUser({
      team_id: user.teamId,
      user_id: user.userId,
      del: true
    })
    if (values.code == 200) {
      res.send({
        code: 200,
        data: '删除成员成功'
      })
    }
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      data: '删除成员失败'
    })
  }
}

let controller = {
  addProjectUser,
  getAllProjects,
  addProject,
  deleteProject,
  changeProject,
  getProject,
  getAllUsers,
  deleteFiles,
  delProjectUser
}

module.exports = controller