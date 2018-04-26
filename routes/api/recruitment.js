const express = require('express')
const router = express.Router()
const controller = require('../../controller/recruitmentController')

// 获取所有的政策制度
router.post('/recruitment', controller.getRecruitmentById)
/**
 * 更改招募信息
 */
router.post('/change/recruitment', controller.changeRecruitment)
// 删除招募信息材料
router.post('/delete/files', controller.deleteFiles)
// 增加招募信息
router.post('/add/recruitment', controller.addRecruitment)


module.exports = router