const userUtil = require('../modal/user')
const userDao = require('../dao/userDao')

let getUser = (req, res, next) => {
    res.send(_user)
}
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

let userController = {
    getUser,
    createUser
}

module.exports = userController