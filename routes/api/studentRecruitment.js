const express = require('express')
const router = express.Router()
const controller = require('../../controller/student/studentRecruitmentController')

// 获取项目扩展信息
router.post('/signup', controller.getSignupById)
router.post('/signups', controller.getSignups)
router.post('/change/signup', controller.changeSingnupById)

router.post('/add/signup', controller.addSignup)
router.post('/delete/files', controller.deleteFiles)
router.post('/signup/options', controller.getOptions)

module.exports = router