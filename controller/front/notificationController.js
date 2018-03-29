const utils = require('../../utils/util')
const notificationDao = require('../../dao/front/notificationDao')
const countDao = require('../../dao/notificationDao')

const getNotifications = async (req, res, next) => {
  try {
    const { pageNum, pageSize } = req.query
    let filter = `state='可用'`
    let count = await countDao.getCount(filter)
    count = count.data[0].number
    let notifications = await notificationDao.getAllNotifications(pageNum, pageSize)
    notifications.data.forEach(p => {
      if (p.introduction) {
        p.introduction = p.introduction.replace(/<[^>]+>/g,"")
      }
      else {
        p.introduction = p.title
      }
      let date = new Date(p.publishTime)
      p.day = date.getDay();
      p.yearMonth = `${date.getFullYear()}.${date.getMonth()}`
      delete p.publishTime
    })
    res.send({
      count,
      notifications: notifications.data
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

const getNotification = async (req, res, next) => {
  try {
    const notificationId = req.body.notificationId
    let notification = await notificationDao.getNotificationById(notificationId)
    utils.formatDate('publishTime', notification.data, 'yyyy-MM-dd')
    notification = notification.data[0]
    console.log(notification)
    res.send(notification)
  } 
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}


let controller = {
  getNotifications,
  getNotification
}

module.exports = controller