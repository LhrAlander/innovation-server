const express = require('express')
const router = express.Router()
const controller = require('../../controller/student/studentTeamController')


// 查询学生团队信息路由
router.get('/teams', controller.getTeams)
// 获取团队扩展信息
router.post('/team/detail', controller.getExpandInfoById)
// 查询学生团队成员信息
router.get('/users', controller.getTeamUsers)


module.exports = router