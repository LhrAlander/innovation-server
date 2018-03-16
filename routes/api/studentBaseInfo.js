const express = require('express')
const router = express.Router()
const controller = require('../../controller/student/studentBaseInfoController')


// 查询学生个人信息路由
router.post('/myInfo', controller.getMyInfo)



module.exports = router