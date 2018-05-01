const express = require('express')
const router = express.Router()
const controller = require('../../controller/teacher/teacherBaseInfoController')


// 查询教师个人信息路由
router.post('/myInfo', controller.getMyInfo)
// 更改教师个人信息路由
router.post('/change/info', controller.changeInfo)



module.exports = router