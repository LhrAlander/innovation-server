const express = require('express')
const router = express.Router()
const controller = require('../../controller/awardController')

// 获取所有获奖信息
router.get('/awards', controller.getAllAwards)
// 修改一个获奖信息
router.post('/change/award', controller.changeAward)
// 增加一个获奖信息
router.post('/add/award', controller.addAward)
// 删除一个获奖信息
router.post('/delete/award', controller.deleteAward)
// 获取所有的获奖成员信息
router.get('/users', controller.getAllUsers)

module.exports = router