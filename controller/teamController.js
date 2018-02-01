const teamDao = require('../dao/teamDao')
const teacherDao = require('../dao/teacherDao')
const studentDao = require('../dao/studentDao')
const projectDao = require('../dao/projectDao')
const utils = require('../utils/util')

// 处理项目信息, 返回完整的项目信息包括项目基本信息，依托单位信息，负责人用户信息，负责老师用户信息
let dealTeamInfo = async _team => {
  let tmp = {}
  const teacherId = _team.teamTeacher
  const studentId = _team.teamPrincipal
  let teacher = await teacherDao.getTeacher(teacherId)
  let student = await studentDao.getStudent(studentId)
  if (teacher.code == 200 && teacher.data.length > 0) {
    teacher = utils.transformRes(teacher.data)[0]
  }
  if (student.code == 200 && student.data.length > 0) {
    student = utils.transformRes(student.data)[0]
  }
  tmp.team = _team
  tmp.teacher = teacher
  tmp.student = student
  return tmp
}

// 获取所有团队信息
let getAllTeams = async (req, res, next) => {
  try {
    let responseData = []
    let team = await teamDao.getAllTeams()
    if (team.code == 200) {
      const teams = utils.transformRes(team.data)
      for (let i = 0; i < teams.length; i++) {
        let tmp = await dealTeamInfo(teams[i])
        responseData.push(tmp)
      }
      res.send({
        code: 200,
        data: responseData
      })
    }
    else {
      throw new Error('获取所有团队信息失败')
    }
  }
  catch (err) {
    console.log('获取所有团队信息失败', err)
    res.send({
      code: 400,
      data: err
    })
  }
}

// 增加团队await
let addTeam = (req, res, next) => {

}

// 删除团队
let deleteTeam = (req, res, next) => {

}

// 更改团队信息
let changeTeam = (req, res, next) => {

}

// 获取一个团队信息
let getTeam = async (req, res, next) => {
  const { teamId } = req.body
  try {
    let team = await teamDao.getTeam(teamId)
    if (team.code == 200 && team.data.length > 0) {
      let responseData = {}
      responseData.team = utils.transformRes(team.data)[0]
      let tmp = await dealTeamInfo(responseData.team)
      responseData = tmp
      let projects = await projectDao.getProjectsByTeam(tmp.team.teamId)
      responseData.projects = utils.transformRes(projects.data)
      res.send({
        code: 200,
        data: responseData
      })
    }
    else {
      throw new Error('获取所有团队信息失败')
    }
  }
  catch (err) {
    console.log('获取一个团队信息失败', err)
    res.send({
      code: 400,
      data: err
    })
  }
}

// 获取所有的团队成员
let getAllUsers = (req, res, next) => {

}

let controller = {
  getAllTeams,
  addTeam,
  deleteTeam,
  changeTeam,
  getTeam,
  getAllUsers
}

module.exports = controller