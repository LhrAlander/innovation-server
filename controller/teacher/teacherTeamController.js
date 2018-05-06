const teamDao = require('../../dao/teamDao')
const utils = require('../../utils/util')


// 获取教师端团队信息
let getTeams = async (req, res, next) => {
  try {
    const userId = req.user.userId
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    if ("teamId" in param) {
      param.teamId = param.teamId[1]
    }
    let filter = utils.obj2MySql(param)
    let count = await teamDao.teacherTeamCount(userId, filter)
    count = count.data[0].number
    let teams = await teamDao.getTeamsByTeacher(userId, pageNum, pageSize, filter)
    console.log(count, teams)
    if (teams.code == 200) {
      res.send({
        code: 200,
        data: teams.data,
        count: count
      })
    }
    else {
      res.status(500).send('查询失败')
    }
  } 
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}



// 获取教师端团队成员信息
let getTeamUsers = async (req, res, next) => {
  try {
    const userId = req.user.userId
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    if ("teamId" in param) {
      param.teamId = param.teamId[1]
    }
    let filter = utils.obj2MySql(param)
    let count = await teamDao.teacherTeamUserCount(userId, filter)
    count = count.data[0].number
    let users = await teamDao.getTeamUsersByTeacher(userId, pageNum, pageSize, filter)
    utils.formatDate(['joinTime'], users.data, 'yyyy-MM-dd')
    if (users.code == 200) {
      res.send({
        code: 200,
        data: users.data,
        count: count,
        user: {
          userId: req.user.userId,
          userName: req.user.username
        }
      })
    }
    else {
      throw new Error('查询失败')
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

let controller = {
  getTeams,
  getTeamUsers
}

module.exports = controller