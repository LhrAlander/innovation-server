const awardDao = require('../dao/awardDao')
const utils = require('../utils/util')


// 获取所有获奖信息
let getAllAwards = (req, res, next) => {
  awardDao.getAllAwards()
    .then(values => {
      values.data = utils.transformRes(values.data)
      utils.formatDate('awardTime', values.data, 'yyyy-MM-dd')
      res.send(values)
    })
    .catch(err => {
      console.log(err)
      res.send({
        code: 400,
        data: err
      })
    })
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
  catch(err) {
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
    let users = await awardDao.getAllUsers()
    if (users.code == 200) {
      console.log(users)
    }
    else {
      throw new Error('查询获奖用户失败')
    }
  }
  catch(err) {
    console.log(err)
  }
}

let controller = {
  getAllAwards,
  changeAward,
  addAward,
  deleteAward,
  getAllUsers
}

module.exports = controller