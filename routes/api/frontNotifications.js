const express = require('express')
const router = express.Router()
const controller = require('../../controller/front/notificationController')

router.get('/notifications', controller.getNotifications)
router.post('/notification', controller.getNotification)

module.exports = router