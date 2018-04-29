const express = require('express')
const router = express.Router()
const controller = require('../../controller/recruitmentController')

router.post('/recruitments', controller.getRecruitments)

// 获取所有的政策制度
router.post('/recruitment', controller.getRecruitmentById)
router.post('/signups', controller.getSingUps)
/**
 * 更改招募信息
 */
router.post('/change/recruitment', controller.changeRecruitment)
router.post('/change/signup', controller.changeSignup)
// 删除招募信息材料
router.post('/delete/files', controller.deleteFiles)
// 增加招募信息
router.post('/add/recruitment', controller.addRecruitment)


module.exports = router