const express = require('express')
const router = express.Router()
const controller = require('../../controller/projectController')

// 获取所有的项目
router.get('/projects', controller.getAllProjects)
// 增加一个项目
router.post('/add/project', controller.addProject)

module.exports = router
