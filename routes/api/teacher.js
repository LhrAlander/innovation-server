const express = require('express')
const router = express.Router()
const controller = require('../../controller/teacherController')

// 教师路由
// 查询所有的教师信息
router.get('/teachers', controller.getAllTeachers)

// 增加教师信息
router.post('/add/teacher', controller.addTeacher)

// 修改教师信息
router.post('/change/teacher', controller.changeTeacher)

// 查询特定教师信息
router.post('/teacher', controller.getTeacher)

module.exports = router