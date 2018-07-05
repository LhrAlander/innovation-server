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
// 获取所有立项信息
router.post('/pend/all', controller.getAllPendProjects)
// 增加一个立项信息
router.post('/add/pendProject', controller.addPendProject)
// 修改一个立项信息
router.post('/change/pendProject', controller.changePendProject)
// 获取一个立项信息
router.post('/get/pendProject', controller.getPendProject)
// 删除立项材料
router.post('/delete/pendProject/files', controller.deletePendProjectFiles)
// 获取所有的待审项目
router.get('/pendProjects', controller.getUnPended)
module.exports = router
