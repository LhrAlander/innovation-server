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
// 增加项目成员
router.post('/add/team/user', controller.addTeamUser)
// 删除项目成员
router.post('/del/team/user', controller.delTeamUser)
// 获取一个团队的照片信息
router.post('/get/teamPhotos', controller.getTeamPhotosById)
// 删除团队照片
router.post('/delete/photo', controller.deleteTeamPhoto)

module.exports = router