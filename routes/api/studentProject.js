const express = require('express')
const router = express.Router()
const controller = require('../../controller/student/studentProjectController')


// 查询学生个人信息路由
router.get('/projects', controller.getProjects)
// 获取项目扩展信息
router.post('/project/detail', controller.getExpandInfoById)

module.exports = router