const authDao = require('../dao/authJudgeDao')
const projectDao = require('../dao/projectDao')
const utils = require('../utils/util')


const jwt = require("jsonwebtoken");

const createAuthToken = flag => {
  var authToken = jwt.sign({
    auth: flag,
    secret: new Date()
  }, "secret", {
      expiresIn: 60 * 5 // 授权时效5min
    });
  return authToken
}

// 判断是否又权限进入项目详细信息界面
let judgeProjectInfo = async (req, res, next) => {
  let projectId = req.body.projectId
  switch (req.user.type) {
    case '学生':
      let values = await authDao.judgeProjectInfoByStudent(req.user.userId, projectId)
      if (values.code == 200 && values.data.length > 0) {
        res.send({
          authToken: createAuthToken(true)
        })
      }
      else {
        res.status(401).send('无权访问')
      }
      break;
    case '教师':
      let teacher = await authDao.judgeEditProjectInfo(projectId)
      if (teacher.code == 200 && teacher.data.length > 0) {
        if (teacher.data[0].project_principal == req.user.userId || teacher.data[0].project_teacher == req.user.userId) {
          res.send({
            authToken: createAuthToken(true)
          })
        }
        else {
          res.status(401).send('无权访问')
        }
      }
      break
    default:
      res.send({
        authToken: createAuthToken(true)
      })
  }
}

// 判断是否又权限进入修改项目详细信息界面
let judgeEditProjectInfo = async (req, res, next) => {
  try {
    let projectId = req.body.projectId
    console.log(req.user, projectId)
    let values = await authDao.judgeEditProjectInfo(projectId)
    console.log(values)
    if (req.user.type == '管理员' || values.code == 200 && values.data.length > 0 && (values.data[0].project_teacher == req.user.userId || values.data[0].project_principal == req.user.userId)) {
      res.send({
        authToken: createAuthToken(true)
      })
    }
    else {
      res.status(401).send('无权访问')
    }
  }
  catch (err) {
    console.log(err)
  }

}

// 判断是否又权限进入团队详细信息界面
let judgeTeamInfo = async (req, res, next) => {
  let teamId = req.body.teamId
  switch (req.user.type) {
    case '学生':
      let values = await authDao.judgeTeamInfoByStudent(req.user.userId, teamId)
      if (values.code == 200 && values.data.length > 0) {
        res.send({
          authToken: createAuthToken(true)
        })
      }
      else {
        res.status(401).send('无权访问')
      }
      break;
    case '教师':
      let teacher = await authDao.judgeEditTeamInfo(teamId)
      if (teacher.code == 200 && teacher.data.length > 0 && (teacher.data[0].team_teacher == req.user.userId || values.data[0].team_principal == req.user.userId)) {
        res.send({
          authToken: createAuthToken(true)
        })
      }
      else {
        res.status(401).send('无权访问')
      }
      break;
  }
}


// 判断是否又权限进入修改项目详细信息界面
let judgeEditTeamInfo = async (req, res, next) => {
  try {
    let teamId = req.body.teamId
    console.log('判断团队权限', teamId)

    let values = await authDao.judgeEditTeamInfo(teamId)
    if (values.code == 200 && values.data.length > 0 && (values.data[0].team_teacher == req.user.userId || values.data[0].team_principal == req.user.userId)) {
      res.send({
        authToken: createAuthToken(true)
      })
    }
    else {
      throw new Error('无权访问')
    }
  }
  catch (err) {
    console.log(err)
    res.status(401).send('无权访问')
  }

}

let judgeUnitInfo = async (req, res, next) => {
  try {
    let unitId = req.body.unitId
    console.log('判断依托单位权限', unitId)

    let values = await authDao.judgeUnitInfo(unitId)
    if (values.code == 200 && values.data.length > 0 && values.data[0].unit_principal == req.user.userId) {
      res.send({
        authToken: createAuthToken(true)
      })
    }
    else {
      throw new Error('无权访问')
    }
  }
  catch (err) {
    console.log(err)
    res.status(401).send('无权访问')
  }
}

let controller = {
  judgeProjectInfo,
  judgeEditProjectInfo,
  judgeTeamInfo,
  judgeEditTeamInfo,
  judgeUnitInfo
}

module.exports = controller