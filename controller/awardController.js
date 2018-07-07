const awardDao = require('../dao/awardDao')
const userDao = require('../dao/userDao')
const projectDao = require('../dao/projectDao')
const utils = require('../utils/util')
const countHelper = require('../utils/DBQuery')


// 获取所有获奖信息
let getAllAwards = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await awardDao.getCount(filter)
    count = count.data[0].number
    let awards = await awardDao.getAllAwards(pageNum, pageSize, filter)
    if (awards.code == 200) {
      utils.formatDate('awardTime', awards.data, 'yyyy-MM-dd')
      res.send({
        code: 200,
        data: awards.data,
        count
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}

// 获取所有获奖名称
let getAllAwardNames = async (req, res, next) => {
  try {
    let names = await awardDao.getAllAwardNames()
    if (names.code == 200) {
      names = names.data.map(name => {
        return name.name
      })
      res.send({
        code: 200,
        data: names
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}

// 修改获奖信息
let changeAward = (req, res, next) => {
  let { award } = req.body
  award = utils.camel2_(award)
  const awardId = award.award_id
  delete award.award_id
  awardDao.updateAward(award, awardId)
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

// 增加一个获奖信息
let addAward = (req, res, next) => {
  let awardId = utils.getId('award')
  let { award } = req.body
  award = utils.camel2_(award)
  award.award_id = awardId
  awardDao.addAward(award)
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

// 删除一个获奖信息
let deleteAward = (req, res, next) => {
  try {
    let { awardId } = req.body
    awardDao.deleteAward(awardId)
      .then(values => {
        if (values.code == 200) {
          res.send({
            code: 200,
            msg: '删除获奖信息成功'
          })
          return awardDao.deleteUsersByAwardId(awardId)
        }
        else {
          throw new Error()
        }
      })
      .then(v => {
        console.log(v)
      })
      .catch(err => {
        console.log(err)
        res.send({
          code: 500,
          msg: '删除获奖信息失败'
        })
      })
  }
  catch (err) {
    console.log('删除获奖信息失败', err.msg, err.message)
    res.send({
      code: 500,
      msg: '删除获奖信息失败'
    })
  }

}

// 获取所有的获奖成员信息
let getAllUsers = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await awardDao.getUserCount(filter)
    count = count.data[0].number
    let users = await awardDao.getAllUsers(pageNum, pageSize, filter)
    if (users.code == 200) {
      users.data.forEach(user => {
        // user.awardName = `${user.awardTime.toLocaleDateString()} ${user.name} ${user.awardLevel} ${user.awardSecondLevel}`
        user.awardName = `${new Date(user.awardTime).getFullYear()} ${user.name} ${user.awardLevel} ${user.awardSecondLevel}`
        if (user.projectId == '个人') {
          user.projectName = '个人'
        }
      })
      res.send({
        code: 200,
        data: users.data,
        count
      })
    }
    else {
      throw new Error('查询获奖用户失败')
    }
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: err.msg || err.message
    })
  }
}

// 增加一个获奖成员信息
let addUser = async (req, res, next) => {
  try {
    let { award, user } = req.body.award
    let filter = utils.obj2MySql(award)
    award = await awardDao.getAwardByFilter(filter)
    console.log(award)
    if (award.code == 200 && award.data.length > 0) {
      user.award_id = award.data[0].award_id
      let values = await awardDao.addUser(user)
      console.log(values)
      if (values.code == 200) {
        res.send({
          code: 200,
          data: '增加获奖成员成功'
        })
      }
    }
    else {
      throw new Error('没有该奖项信息')
    }
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '没有该奖项信息'
    })
  }
}

let insertAwardUsersFromExcel = async (req, res, next) => {
  try {
    let users = req.body.users
    let eUsers = []
    for (let i = 0; i < users.length; i++) {
      let u = users[i]

      let _award = {
        award_name: u['奖项名称'],
        award_identity: u['奖项类别'],
        award_level: u['奖项等级']
      }
      let filter = utils.obj2MySql(_award)
      filter = utils.yearMysql([{ award_time: u['获奖年份（四位数字）'] }], filter)
      // 构建获奖 ID
      let award = await awardDao.getAwardByFilter(filter)
      if (award.code == 200 && award.data.length > 0) {
        _award.award_id = award.data[0].award_id
      }
      else {
        _award.award_id = utils.getId('award')
        _award.award_time = `${u['获奖年份（四位数字）']}-1-1`
        await awardDao.addAward(_award)
      }
      // 构建项目 ID
      let projectId = u['获奖项目（个人或者项目名称）']
      if (projectId !== '个人') {
        let _p = await projectDao.getProjectByName(projectId)
        if (_p.data.length > 0) {
          projectId = _p.data[0].project_id
        }
        else {
          projectId = '个人'
        }
      }
      // 构建获奖人员信息
      let _users = u['获奖人员（以中文半角顿号分隔多个名字）'].split('、')
      let _userIds = []
      for (let i = 0; i < _users.length; i++) {
        let username = _users[i]
        let user = await userDao.getUserByName(username)
        let user_id = user.data[0].user_id
        console.log(user_id, projectId, _award.award_id)
        let values = await awardDao.addUser({
          user_id,
          award_id: _award.award_id,
          award_project: projectId
        })
        console.log(values)
        if (values.code != 200) {
          eUsers.push({
            user_id,
            award_id: _award.award_id,
            award_project: projectId
          })
        }
      }
    }
    res.send({
      code: 200,
      eUsers
    })
  }
  catch (err) {
    console.log(err)
  }
}

// 删除一个获奖成员信息
let deleteUser = (req, res, next) => {
  const { award } = req.body
  console.log(award)
  awardDao.deleteUser(award.awardId, award.userId)
    .then(values => {
      console.log(values)
      res.send({
        code: 200,
        msg: '删除获奖成员成功'
      })
    })
    .catch(err => {
      console.log(err)
      res.send({
        code: 500,
        msg: '删除获奖成员失败'
      })
    })
}

let controller = {
  getAllAwards,
  getAllAwardNames,
  changeAward,
  addAward,
  deleteAward,
  getAllUsers,
  addUser,
  insertAwardUsersFromExcel,
  deleteUser
}

module.exports = controller