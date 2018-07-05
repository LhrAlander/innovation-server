const dependentDao = require('../dao/dependentDao')
const userDao = require('../dao/userDao')
const teamDao = require('../dao/teamDao')
const projectDao = require('../dao/projectDao')
const utils = require('../utils/util')
const countHelper = require('../utils/DBQuery')

// 级联获取 依托单位 -> 团队 -> 项目 信息
let getSelectors = async (req, res, next) => {
  try {
    let deps = await dependentDao.getAllDependents()
    let responseData = deps.data.map(dep => {
      return {
        unitId: dep.unit_id,
        unitName: dep.unit_name
      }
    })
    for (let i = 0; i < responseData.length; i++) {
      let unit = responseData[i]
      let teams = await teamDao.getTeamsByUnit(unit.unitId)
      teams = teams.data.map(team => {
        return {
          teamId: team.team_id,
          teamName: team.team_name
        }
      })
      unit.teams = teams
      for (let i = 0; i < teams.length; i++) {
        let team = teams[i]
        let projects = await projectDao.getProjectsByTeam(team.teamId)
        projects = projects.data.map(project => {
          return {
            projectId: project.project_id,
            projectName: project.project_name
          }
        })
        team.projects = projects
      }
    }
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
let getAllDependents = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await dependentDao.getCount(filter)
    count = count.data[0].number
    let units = await dependentDao.getAllDependents(pageNum, pageSize, filter)
    if (units.code == 200) {
      res.send({
        code: 200,
        data: units.data,
        count
      })
    }
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
  try {
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
          console.log(err)
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
  catch (err) {
    console.log(err)
  }

}

// 添加一个依托单位信息
let addDependent = async (req, res, next) => {
  try {
    let unitId = utils.getId('dependent')
    let { dependent } = req.body
    dependent.unit_id = unitId
    dependent.unit_state = '可用'
    const userId = dependent.unit_principal
    let user = await userDao.searchUser(userId)
    if (user.code == 200 && user.data.length > 0) {
      dependentDao.addDependent(dependent)
        .then(values => {
          res.send(values)
        })
        .catch(err => {
          console.log(err)
          res.send(err)
          throw new Error(err)
        })
    }
    else {
      throw new Error('不存在该负责人')
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
    user = utils.transformRes(user.data)[0]
    teams = utils.transformRes(teams.data)
    dependent = utils.transformRes(dependent.data)[0]
    let _teams = []
    let tmp = []
    for (let i = 0; i < teams.length; i++) {
      tmp.push({
        name: teams[i].teamName,
        teamId: teams[i].teamId
      })
      if (i & 1 == 1 && i > 0) {
        _teams.push(tmp)
        tmp = []
      }
    }
    if (tmp.length > 0) {
      _teams.push(tmp)
    }

    let responseData = {
      unit: {
        unitName: dependent.unitName,
        unitType: dependent.unitIdentity,
        unitPerson: user.userName,
        unitAddress: dependent.unitAddress,
        unitPhone: dependent.unitPhone,
      },
      user: {
        userId: user.userId,
        name: user.userName,
        userPhone: user.userPhone
      },
      teams: _teams
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


// 删除一个依托单位
let delDependent = (req, res, next) => {
  let { unitId, payload } = req.body
  dependentDao.updateDependent(payload, unitId)
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

// 获取所有单位负责人形成选项
const getLeaderChoices = async (req, res, next) => {
  try {
    let names = await dependentDao.getLeaderChoices()
    names = names.data.map(n => {
      return {
        label: n.user_name,
        value: n.user_id,
        userPhone: n.user_phone
      }
    })
    res.send({
      code: 200,
      names
    })
  } 
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '查询信息失败'
    })  
  }
}


let controller = {
  getAllDependents,
  changeDependent,
  changeDependent,
  addDependent,
  getDependent,
  getSelectors,
  delDependent,
  getLeaderChoices
}
module.exports = controller