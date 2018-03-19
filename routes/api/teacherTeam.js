const express = require('express')
const router = express.Router()
const controller = require('../../controller/teacher/teacherTeamController')


// 查询学生团队信息路由
router.get('/teams', controller.getTeams)
// 查询学生团队成员信息
router.get('/users', controller.getTeamUsers)


module.exports = router