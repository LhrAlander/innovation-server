const express = require('express')
const router = express.Router()
const controller = require('../../controller/front/indexController')

router.get('/notifications', controller.getNotifications)
router.get('/teams', controller.geTeams)
router.get('/policys', controller.getPolicys)
router.get('/files', controller.getFileSystems)

module.exports = router