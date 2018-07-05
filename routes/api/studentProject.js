const express = require('express')
const router = express.Router()
const controller = require('../../controller/student/studentProjectController')


// 查询学生项目信息路由
router.get('/projects', controller.getProjects)
// 获取项目扩展信息
router.post('/project/detail', controller.getExpandInfoById)
// 查询学生项目成员路由
router.get('/users', controller.getPojrectUsers)
// 立项
router.post('/create/project', controller.createPendProject)
// 学生待审项目
router.get('/pendProjects', controller.getPendProjects)

module.exports = router