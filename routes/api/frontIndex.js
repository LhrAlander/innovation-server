const express = require('express')
const router = express.Router()
const baseInfoController = require('../../controller/baseInfoController')
const controller = require('../../controller/front/indexController')

router.get('/notifications', controller.getNotifications)
router.get('/teams', controller.geTeams)
router.get('/policys', controller.getPolicys)
router.get('/files', controller.getFileSystems)
router.get('/academys', baseInfoController.getAllAcademy)
router.post('/reg', controller.reg)

module.exports = router