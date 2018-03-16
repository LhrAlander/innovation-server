const express = require('express')
const router = express.Router()
const controller = require('../../controller/student/studentTeamController')


// 查询学生个人信息路由
router.get('/teams', controller.getTeams)
// 获取团队扩展信息
router.post('/team/detail', controller.getExpandInfoById)



module.exports = router