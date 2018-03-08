const userUtil = require('../modal/user')
const userDao = require('../dao/userDao')
const countHelper = require('../utils/DBQuery')
const utils = require('../utils/util')

// 获取所有用户信息
let getUsers = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    let count = null
    let filter = utils.obj2MySql(param)
    if (filter != null) {
      count = await countHelper.getTableCount('user', filter)
    }
    else {
      count = await countHelper.getTableCount('user', null)
    }
    count = count.data[0].number
    userDao.getUsers(pageNum, pageSize, filter)
      .then(result => {
        if (result.code == 200) {
          let responseData = []
          delete result.msg
          result.data.forEach((item, index) => {
            let data = {
              // 表格数据
              id: index + 1,
              username: item.user_id,
              name: item.user_name,
              role: item.user_identity,
              status: item.account_state,
              phone: item.user_phone,
              email: item.user_mail
            }
            responseData.push(data)
          })

          res.send({
            code: 200,
            data: responseData,
            count: count
          })
        }
      })
      .catch(err => {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
      })
  }
  catch (err) {
    console.log(err)
  }

}

// 增加一个用户
let createUser = async (req, res, next) => {
  let user = req.body.user
  user.user_pwd = '123456'
  user.account_state = '可用'
  console.log(user)
  let result = await userDao.createUser(user);
  console.log(result)
  res.send(result)

}

// 删除一个用户
let delUser = (req, res, next) => {
  // 获取前端传过来的数据
  const userId = req.body.userId
  const userState = req.body.state
  // 构建需要传给dao层需要的数据
  let user = {}
  user.account_state = userState
  // 将数据传给dao，自然就获取到了数据
  userDao.changeUserInfo(user, userId)
    .then(result => {
      // 当dao层正确完成了数据库的操作后返回数据再这里
      // 上一步得到数据，加工之后返回数据给前端
      if (result.code == 200) {
        delete result.msg
        res.send(result)
      }
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}

// 查找一个用户
let searchUser = (req, res, next) => {
  const userId = req.body.userId
  if (userId == null) {
    res.send({
      code: 404
    })
    return
  }
  else {
    userDao.searchUser(userId)
      .then(result => {
        if (result.code == 200 && result.data.length > 0) {
          delete result.msg
          res.send(result)
        }
        else {
          res.send({
            code: 400,
            msg: '无该用户信息'
          })
        }
      })
      .catch(err => {
        delete err.msg
        res.send(err)
      })
  }
}

// 修改一个用户的信息
let changeUser = (req, res, next) => {
  let user = req.body.user
  if (typeof user == 'string') {
    user = JSON.parse(user)
  }
  if (user == null) {
    res.send({
      code: 404
    })
    return
  }
  else {
    user = utils.camel2_(user)
    userDao.changeUserInfo(user, user.user_id)
      .then(result => {
        if (result.code == 200) {
          delete result.msg
          res.send(result)
        }
      })
      .catch(err => {
        delete err.msg
        res.send(err)
      })
  }
}

let userController = {
  getUsers,
  createUser,
  delUser,
  searchUser,
  changeUser
}

module.exports = userController