const teamDao = require('../dao/teamDao')
const teacherDao = require('../dao/teacherDao')
const studentDao = require('../dao/studentDao')
const userDao = require('../dao/userDao')
const projectDao = require('../dao/projectDao')
const unitDao = require('../dao/dependentDao')
const utils = require('../utils/util')
const countHelper = require('../utils/DBQuery')

// 处理项目信息, 返回完整的项目信息包括项目基本信息，依托单位信息，负责人用户信息，负责老师用户信息
let dealTeamInfo = async _team => {
  try {
    let tmp = {}
    const teacherId = _team.teamTeacher
    const studentId = _team.teamPrincipal
    const unitId = _team.teamDependentUnit
    let teacher = await userDao.searchUser(teacherId)
    let student = await studentDao.getStudent(studentId)
    let unit = await unitDao.getDependent(unitId)
    if (teacher.code == 200 && teacher.data.length > 0) {
      teacher = utils.transformRes(teacher.data)[0]
    }
    if (student.code == 200 && student.data.length > 0) {
      student = utils.transformRes(student.data)[0]
    }
    if (unit.code == 200 && unit.data.length > 0) {
      unit = utils.transformRes(unit.data)[0]
    }
    tmp.team = _team
    tmp.teacher = teacher
    tmp.student = student
    tmp.unit = unit
    return tmp
  }
  catch (err) {
    console.log(err)
  }

}

// 获取所有团队信息
let getAllTeams = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await teamDao.getCount(filter)
    count = count.data[0].number
    let team = await teamDao.getAllTeams(pageNum, pageSize, filter)
    if (team.code == 200) {
      let teams = utils.transformRes(team.data)
      teams = team.data
      for (let i = 0; i < teams.length; i++) {
        teams[i].id = i + 1
      }
      res.send({
        code: 200,
        data: teams,
        count
      })
    }
    else {
      throw new Error('获取所有团队信息失败')
    }
  }
  catch (err) {
    console.log('获取所有团队信息失败', err)
    res.send({
      code: 500,
      data: err
    })
  }
}

// 增加团队
let addTeam = (req, res, next) => {
  let teamId = utils.getId('team')
  let team = req.body.team
  console.log(team)
  team.team_id = teamId
  const teacherId = team.team_teacher
  const studentId = team.team_principal
  // 确保提交过来的负责人和指导老师存在
  Promise.all([userDao.searchUser(teacherId), userDao.searchUser(studentId)])
    .then(values => {
      if (values[0].code == 200 && values[0].data.length > 0 && values[1].code == 200 && values[1].data.length > 0) {
        return teamDao.addTeam(team)
      }
      else {
        throw new Error('无效负责人或者无效指导老师')
      }
    })
    .then(values => {
      let addTime = new Date()
      addTime = `${addTime.getFullYear()}-${addTime.getMonth() + 1}-${addTime.getDate()}`
      return teamDao.addTeamUser({
        team_id: team.team_id,
        user_id: team.team_principal,
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

// 删除团队
let deleteTeam = (req, res, next) => {
  let { teamId, payload } = req.body
  teamDao.updateTeam(payload, teamId)
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

// 更改团队信息
let changeTeam = (req, res, next) => {
  try {
    let { team } = req.body
    const teamId = team.team_id
    delete team.team_id
    teamDao.updateTeam(team, teamId)
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
  catch (err) {
    console.log(err)
  }

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
      let projects = await projectDao.getProjectsByTeam(tmp.team.teamId)
      tmp.projects = utils.transformRes(projects.data)
      responseData = {
        team: {
          teamName: tmp.team.teamName,
          teamId: tmp.team.teamId,
          teamLeader: tmp.student.userName,
          supportOrg: tmp.unit.unitName,
          teamTeacher: tmp.teacher.userName,
          leaderMajor: tmp.student.studentMajor,
          leaderClass: tmp.student.studentClass,
          teamInfo: tmp.team.teamIntroduction,
          unitId: tmp.unit.unitId
        },
        leader: {
          userId: tmp.student.userId,
          name: tmp.student.userName,
          userPhone: tmp.student.userPhone
        },
        teacher: {
          userId: tmp.teacher.userId,
          name: tmp.teacher.userName,
          userPhone: tmp.teacher.userPhone
        },
        proInfo: tmp.projects
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
    console.log('获取一个团队信息失败', err)
    res.send({
      code: 500,
      data: err
    })
  }
}

// 获取所有的团队成员
let getAllUsers = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await teamDao.getUserCount(filter)
    count = count.data[0].number
    let users = await teamDao.getAllUsers(pageNum, pageSize, filter)
    if (users.code == 200) {
      utils.formatDate(['joinTime'], users.data, 'yyyy-MM-dd')
      res.send({
        code: 200,
        data: users.data,
        count
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}

// 增加项目成员
let addTeamUser = (req, res, next) => {
  let { user } = req.body
  const { team_id, user_id } = user
  Promise.all([userDao.searchUser(user_id), teamDao.getTeam(team_id)])
    .then(values => {
      if (values.every((el, index, array) => {
        console.log(el)
        return el.code == 200
      })) {
        return teamDao.addTeamUser(user)
      }
      else {
        throw new Error('无效用户或者无效项目')
      }
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

// 删除团队成员
let delTeamUser = async (req, res, next) => {
  try {
    const { user } = req.body
    user.leave_time = new Date().toLocaleDateString()
    let values = await teamDao.delTeamUser(user)
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
  addTeamUser,
  getAllTeams,
  addTeam,
  deleteTeam,
  changeTeam,
  getTeam,
  getAllUsers,
  delTeamUser
}

module.exports = controller