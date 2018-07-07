const express = require('express')
const router = express.Router()
const controller = require('../../controller/awardController')

// 获取所有获奖信息
router.get('/awards', controller.getAllAwards)
// 获取所有获奖名称
router.get('/awardNames', controller.getAllAwardNames)
// 修改一个获奖信息
router.post('/change/award', controller.changeAward)
// 增加一个获奖信息
router.post('/add/award', controller.addAward)
// 删除一个获奖信息
router.post('/delete/award', controller.deleteAward)
// 获取所有的获奖成员信息
router.get('/users', controller.getAllUsers)
// 增加一个获奖成员信息
router.post('/add/user', controller.addUser)
// 删除一个获奖成员信息
router.post('/delete/user', controller.deleteUser)
// 从excel导入获奖人员信息
router.post('/insert/awardusersfromexcel', controller.insertAwardUsersFromExcel)
module.exports = router