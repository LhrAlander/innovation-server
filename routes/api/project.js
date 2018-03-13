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
// 获取所有的项目成员
router.get('/users', controller.getAllUsers)
// 删除材料附件
router.post('/delete/files', controller.deleteFiles)
// 增加项目成员
router.post('/add/project/user', controller.addProjectUser)
// 删除一个项目成员
router.post('/del/project/user', controller.delProjectUser)

module.exports = router
