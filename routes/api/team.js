const express = require('express')
const router = express.Router()
const controller = require('../../controller/teamController')

// 获取所有的团队
router.get('/teams', controller.getAllTeams)
// 增加一个团队
router.post('/add/team', controller.addTeam)
// 删除一个团队
router.post('/delete/team', controller.deleteTeam)
// 修改一个团队
router.post('/change/team', controller.changeTeam)
// 获取一个团队信息
router.post('/team', controller.getTeam)
// 获取所有团队成员
router.get('/users', controller.getAllUsers)

module.exports = router