const express = require('express')
const router = express.Router()
const controller = require('../../controller/student/studentAwardController')


// 查询学生获奖信息路由
router.get('/awards', controller.getAwards)



module.exports = router