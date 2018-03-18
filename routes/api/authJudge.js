const express = require('express')
const router = express.Router()
const controller = authJudgeController = require('../../controller/authJudgeController')


router.post('/projectInfo', controller.judgeProjectInfo)
router.post('/edit/projectInfo', controller.judgeEditProjectInfo)
router.post('/teamInfo', controller.judgeTeamInfo)
router.post('/edit/teamInfo', controller.judgeEditTeamInfo)

module.exports = router