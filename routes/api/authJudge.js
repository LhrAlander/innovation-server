const express = require('express')
const router = express.Router()
const controller = authJudgeController = require('../../controller/authJudgeController')


router.post('/projectInfo', controller.judgeProjectInfo)
router.post('/edit/projectInfo', controller.judgeEditProjectInfo)

module.exports = router