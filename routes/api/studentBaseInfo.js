const express = require('express')
const router = express.Router()
const controller = require('../../controller/student/studentBaseInfoController')


// 查询学生个人信息路由
router.post('/myInfo', controller.getMyInfo)
// 更改学生个人信息路由
router.post('/change/info', controller.changeInfo)



module.exports = router