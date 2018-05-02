const projectDao = require('../../dao/projectDao')
const utils = require('../../utils/util')
// 获取教师端项目信息
let getProjects = async (req, res, next) => {
  try {
    const userId = req.user.userId
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    console.log(param)
    let rgy = null
    let sty = null
    let finy = null
    let y = []
    if ('beginYear' in param && param['beginYear'] != '') {
      rgy = param['beginYear']
      y.push({
        beginYear: rgy
      })
      delete param['beginYear']
    }
    if ('applyYear' in param && param['applyYear'] != '') {
      sty = param['applyYear']
      y.push({
        applyYear: sty
      })
      delete param['applyYear']
    }
    if ('deadlineYear' in param && param['deadlineYear'] != '') {
      finy = param['deadlineYear']
      y.push({
        deadlineYear: finy
      })
      delete param['deadlineYear']
    }
    if ('dependentUnit' in param) {
      param.teamId = param.dependentUnit[1]
      delete param['dependentUnit']
    }
    let filter = utils.obj2MySql(param)
    filter = utils.yearMysql(y, filter)
    let count = await projectDao.teacherProjectCount(userId, filter)
    count = count.data[0].number
    let projects = await projectDao.getProjectsByTeacher(userId, pageNum, pageSize, filter)
    utils.formatDate(['applyYear', 'beginYear', 'deadlineYear'], projects.data, 'yyyy-MM-dd')
    if (projects.code == 200) {
      res.send({
        code: 200,
        data: projects.data,
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


// 获取教师端项目成员信息
let getPojrectUsers = async (req, res, next) => {
  try {
    const userId = req.user.userId
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    if ('projectName' in param) {
      param.projectId = param.projectName[2]
      delete param.projectName
    }
    console.log(param)
    let filter = utils.obj2MySql(param)
    let count = await projectDao.teacherProjectUserCount(userId, filter)
    count = count.data[0].number
    let users = await projectDao.getProjectUsersByTeacher(userId, pageNum, pageSize, filter)
    utils.formatDate(['joinTime'], users.data, 'yyyy-MM-dd')
    console.log(users.data)
    if (users.data.length > 0 && users.data[0].userId == null) {
      users.data = []
    }
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
      res.status(500).send('查询失败')
    }
  }
  catch (err) {
    console.log(err)
  }
}

let controller = {
  getProjects,
  getPojrectUsers
}

module.exports = controller