const express = require('express')
const router = express.Router()
const controller = require('../../controller/teacher/teacherProjectController')


// 查询教师项目信息路由
router.get('/projects', controller.getProjects)
// 查询教师项目成员路由
router.get('/users', controller.getPojrectUsers)

module.exports = router