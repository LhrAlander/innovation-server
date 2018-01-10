const express = require('express')
const router = express.Router()
const controller = require('../../controller/studentController')

// 学生路由
// 查询所有的学生信息
router.get('/students', controller.getAllStudents)

// 增加学生信息
router.post('/add/student', controller.addStudent)

// 修改学生信息
router.post('/change/student', controller.changeStudent)

// 查询特定学生信息
router.post('/student', controller.getStudent)

module.exports = router