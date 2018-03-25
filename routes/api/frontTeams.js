const express = require('express')
const router = express.Router()
const controller = require('../../controller/front/teamController')

router.get('/teams', controller.getTeams)
router.post('/team', controller.getTeam)

module.exports = router