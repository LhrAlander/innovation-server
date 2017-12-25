const userUtil = require('../modal/user')
const userDao = require('../dao/userDao')

let getUser = (req, res, next) => {
    res.send(_user)
}

// 增加一个用户
let createUser = (req, res, next) => {
    let _user =  userUtil.createUser('2015210405043', '林海瑞', '男', 'AlanderLt@163.com', '13588737694', '待审核', '学生')
    userDao.createUser(_user)
    .then(result => {
        console.log(result)
        res.send(result)
    })
    .catch(err => {
        console.log(err)
        res.send(err)
    })
}

// 删除一个用户
let delUser = (req, res, next) => {
    // 获取前端传过来的数据
    const userId = req.body.userId
    const userState = req.body.state
    // 构建需要传给dao层需要的数据
    let user = {}
    user.account_state = userState
    user.user_mail = '1147816814@qq.com'
    // 将数据传给dao，自然就获取到了数据
    userDao.changeUserInfo(user, userId)
    .then(result => {
        // 当dao层正确完成了数据库的操作后返回数据再这里
        console.log(result)
        // 上一步得到数据，加工之后返回数据给前端
        res.send(result)
    })
    .catch(err => {
        console.log(err)
        res.send(err)
    })
}

let userController = {
    getUser,
    createUser,
    delUser
}

module.exports = userController