const express = require('express')
const router = express.Router()
const controller = require('../../controller/projectController')

// 获取所有的项目
router.get('/projects', controller.getAllProjects)
// 增加一个项目
router.post('/add/project', controller.addProject)
// 删除一个项目
router.post('/delete/project', controller.deleteProject)
// 修改一个项目
router.post('/change/project', controller.changeProject)
// 获取一个项目信息
router.post('/project', controller.getProject)

module.exports = router
