const express = require('express')
const router = express.Router()
const userController = require('../../controller/userController')

// 用户路由
// 查询所有用户
router.get('/users', userController.getUsers)
// 查询特定用户
router.post('/searchUser', userController.searchUser)
// 增加一个用户
router.post('/user', userController.createUser)
// 注销一个用户
router.post('/delUser', userController.delUser)
// 更改一个用户的信息
router.post('/changeUser', userController.changeUser)

module.exports = router;
