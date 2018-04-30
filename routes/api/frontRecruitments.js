const express = require('express')
const router = express.Router()
const controller = require('../../controller/front/recruitmentController')

/**
 * 前端获取所有的招募信息列表
 */
router.post('/recruitments', controller.getRecruitments)
/**
 * 前端获取某一招募信息的详情
 */
router.post('/recruitment', controller.getRecruitment)
router.get('/side', controller.getSideItems)


module.exports = router