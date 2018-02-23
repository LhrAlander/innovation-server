const express = require('express')
const router = express.Router()
const controller = require('../../controller/notificationController')

// 获取所有的通知公告
router.get('/notifications', controller.getAllNotifications)
// 获取一个通知公告
router.post('/notification', controller.getNotification)
// 删除通知公告材料
router.post('/delete/files', controller.deleteFiles)
// 修改通知公告信息
router.post('/change/notification', controller.updateNotification)

module.exports = router