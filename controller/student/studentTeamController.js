const teamDao = require('../../dao/teamDao')
const utils = require('../../utils/util')


// 获取学生端团队信息
let getTeams = async (req, res, next) => {
  try {
    const userId = req.user.userId
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await teamDao.studentTeamCount(userId, filter)
    count = count.data[0].number
    let teams = await teamDao.getTeamsByStudent(userId, pageNum, pageSize, filter)
    console.log(teams, count)
    if (teams.code == 200 && teams.data.length > 0) {
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

// 获取团队展开信息
let getExpandInfoById = async (req, res, next) => {
  try {
    const { teamId } = req.body
    console.log(teamId)
    let values = await teamDao.getExpandInfoByTeamId(teamId)
    if (values.code == 200 && values.data.length > 0) {
      res.send({
        code: 200,
        data: values.data
      })
    }
    else {
      throw new Error('查询失败')
    }

  }
  catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

let controller = {
  getTeams,
  getExpandInfoById
}

module.exports = controller