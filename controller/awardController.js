const awardDao = require('../dao/awardDao')
const utils = require('../utils/util')
const countHelper = require('../utils/DBQuery')


// 获取所有获奖信息
let getAllAwards = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    let count = await countHelper.getTableCount('award')
    count = count.data[0].number
    let responseData = []
    let awards = await awardDao.getAllAwards()
    if (awards.code == 200) {
      awards.data = utils.transformRes(awards.data)
      utils.formatDate('awardTime', awards.data, 'yyyy-MM-dd')
      awards = awards.data
      for (let i = 0; i < awards.length; i++) {
        let award = awards[i]
        responseData.push({
          awardName: award.awardName,
          awardLevel: award.awardLevel,
          awardSecondLevel: award.awardIdentity,
          awardTime: award.awardTime
        })
      }
      console.log(responseData)
      res.send({
        code: 200,
        data: responseData,
        count
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
    teamDao.deleteAward(awardId)
      .then(values => {
        if (values.code == 200) {
          res.send({
            code: 200,
            msg: '删除获奖信息成功'
          })
        }
        else {
          throw new Error()
        }
      })
      .catch(err => {
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
    let count = await countHelper.getTableCount('award_user')
    count = count.data[0].number
    let responseData = []
    let users = await awardDao.getAllUsers()
    if (users.code == 200) {
      let awards = utils.transformRes(users.data)
      let responseData = []
      utils.formatDate('awardTime', awards, 'yyyy-MM-dd')
      awards.forEach(award => {
        console.log(award)
        responseData.push({
          awardName: award.awardName,
          projectName: award.projectName || '个人',
          username: award.userName,
          contact: award.userPhone,
          userId: award.userId
        })
      })
      res.send({
        code: 200,
        data: responseData,
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
let addUser = (req, res, next) => {
  let { award } = req.body
  award = utils.camel2_(award)
  awardDao.addUser(award)
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send({
        code: 500,
        msg: '添加获奖成员信息失败'
      })
    })
}

// 删除一个获奖成员信息
let deleteUser = (req, res, next) => {
  const { award } = req.body
  awardDao.deleteUser(award.awardId, award.userId)
    .then(values => {
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
  changeAward,
  addAward,
  deleteAward,
  getAllUsers,
  addUser,
  deleteUser
}

module.exports = controller