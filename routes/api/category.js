// 用户类别管理
const express = require('express')
const router = express.Router()
const controller = require('../../controller/categoryController')
// 获取所有用户类别
router.get('/users', controller.getAllUserCategories)
// 删除用户类别
router.post('/delete/users', controller.deleteUserCategory)
// 添加用户类别
router.post('/add/users', controller.addUserCategory)


module.exports = router