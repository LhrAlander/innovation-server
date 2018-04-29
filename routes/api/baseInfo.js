const express = require('express')
const router = express.Router()
const baseInfoController = require('../../controller/baseInfoController')

// 查询所有学院
router.get('/academys', baseInfoController.getAllAcademy)
// 更改学院名称
router.post('/change/academy', baseInfoController.changeAcademy)
// 查询学院下的专业
router.post('/majors', baseInfoController.getMajorByAcademy)
// 更改专业名称
router.post('/change/major', baseInfoController.changeMajor)
// 查询专业下的所有班级
router.post('/classes', baseInfoController.getClassByMajor)
// 删除班级
router.post('/delete/class', baseInfoController.deleteClass)
// 删除专业
router.post('/delete/major', baseInfoController.deleteMajor)
// 删除学院
router.post('/delete/academy', baseInfoController.deleteAcademy)
// 增加学院
router.post('/add/academy', baseInfoController.addAcademy)
// 增加专业
router.post('/add/major', baseInfoController.addMajor)
// 增加班级
router.post('/add/class', baseInfoController.addClass)
module.exports = router