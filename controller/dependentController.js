const dependentDao = require('../dao/dependentDao')
const userDao = require('../dao/userDao')
const teamDao = require('../dao/teamDao')
const projectDao = require('../dao/projectDao')
const utils = require('../utils/util')

// 级联获取 依托单位 -> 团队 -> 项目 信息
let getSelectors = async (req, res, next) => {
  try {
    let dep = await dependentDao.getAllDependents()
    let responseData = []
    await dep.data.forEach(async item => {
      let teams = await teamDao.getTeamsByUnit(item.unit_id)
      let tmp = {
        unitId: item.unit_id,
        unitName: item.unit_name,
        teams: []
      }
      await teams.data.forEach(async (team, index) => {
        let projects = await projectDao.getProjectsByTeam(team.team_id)
        tmp.teams.push({
          teamId: team.team_id,
          teamName: team.team_name,
          projects: []
        })

        await projects.data.forEach(async project => {
          tmp.teams[index].projects.push({
            projectId: project.project_id,
            projectName: project.project_name
          })
        })
        responseData.push(tmp)
        console.log(responseData)
      })
      console.log(responseData)
    })
    console.log(responseData)
    res.send({
      code: 200,
      data: responseData
    })
  }
  catch (err) {
    console.log('err', err)
    res.send({
      code: 500,
      msg: '获取数据失败'
    })
  }

}

// 获取所有的依托单位信息
let getAllDependents = (req, res, next) => {
  try {
    dependentDao.getAllDependents()
      .then(values => {
        res.send(values)
      })
      .catch(err => {
        throw new Error(err)
      })
  }
  catch (err) {
    console.log('获取所有依托单位信息失败', err)
    res.send({
      code: 500,
      data: err
    })
  }
}

// 修改一个依托单位信息
let changeDependent = async (req, res, next) => {
  let { dependent } = req.body
  utils.camel2_(dependent)
  const userId = dependent.unit_principal
  let user = await userDao.searchUser(userId)
  if (user.code == 200 && user.data.length > 0) {
    const unitId = dependent.unit_id
    delete dependent.unit_id
    dependentDao.updateDependent(dependent, unitId)
      .then(values => {
        res.send(values)
      })
      .catch(err => {
        res.send({
          code: 500,
          msg: '修改依托单位信息失败'
        })
      })
  }
  else {
    res.send({
      code: 400,
      msg: '负责人不存在'
    })
  }
}

// 添加一个依托单位信息
let addDependent = async (req, res, next) => {
  try {
    let unitId = utils.getId('dependent')
    let { dependent } = req.body
    dependent.unit_id = unitId
    const userId = dependent.unit_principal
    let user = await userDao.searchUser(userId)
    if (user.code == 200 && user.data.length > 0) {
      dependentDao.addDependent(dependent)
        .then(values => {
          res.send(values)
        })
        .catch(err => {
          throw new Error(err)
        })
    }
    else {
      throw new Error('不存在改负责人')
    }
  }
  catch (err) {
    console.log('添加依托单位信息失败', err)
    res.send({
      code: 500,
      msg: err.message || err.msg
    })
  }

}

// 获取一个依托单位信息
let getDependent = async (req, res, next) => {
  const { unitId } = req.body
  try {
    let dependent = await dependentDao.getDependent(unitId)
    const userId = dependent.data[0].unit_principal
    console.log(unitId, dependent, userId)
    let user = await userDao.searchUser(userId)
    let teams = await teamDao.getTeamsByUnit(unitId)
    let responseData = {
      unit: utils.transformRes(dependent.data)[0],
      user: utils.transformRes(user.data)[0],
      teams: utils.transformRes(teams.data)
    }
    res.send({
      code: 200,
      data: responseData
    })
  }
  catch (err) {
    console.log('获取一个政策信息失败', err)
    res.send({
      code: 500,
      data: err
    })
  }
}


let controller = {
  getAllDependents,
  changeDependent,
  changeDependent,
  addDependent,
  getDependent,
  getSelectors
}
module.exports = controller