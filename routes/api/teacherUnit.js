const express = require('express')
const router = express.Router()
const controller = require('../../controller/teacher/teacherUnitController')


// 查询教师依托单位信息
router.get('/units', controller.getUnits)


module.exports = router