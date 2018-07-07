const userUtil = require('../modal/user')
const userDao = require('../dao/userDao')
const countHelper = require('../utils/DBQuery')
const utils = require('../utils/util')

// 获取所有用户信息
let getUsers = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await userDao.getCount(filter)
    count = count.data[0].number
    let users = await userDao.getUsers(pageNum, pageSize, filter)
    if (users.code == 200) {
      res.send({
        code: 200,
        data: users.data,
        count
      })
    }
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
let createUsers = async (req, res, next) => {
  try {
    let users = req.body.users
    let eUsers = []
    let v = []
    for (let i = 0; i < users.length; i++) {
      let u = users[i]
      let user = {
        user_id: u['学号/工号'],
        user_name: u['姓名'],
        user_sex: u['性别'],
        user_identity: u['账号类别（仅限学生、教师、企业）'],
        user_pwd: '123456',
        account_state: '可用'
      }
      let result = await userDao.createUser(user)
      if (result.code != 200) {
        eUsers.push({
          '学号': user.user_id,
          '姓名': user.user_name
        })
      }
    }
    res.send({
      code: 200,
      eUsers
    })
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '导入失败'
    })
  }
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
  createUsers,
  delUser,
  searchUser,
  changeUser
}

module.exports = userController