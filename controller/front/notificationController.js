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
    let files = await countDao.getFilesByNotification(notificationId)
    files = utils.transformRes(files.data)
    console.log(notification)
    res.send({
      code: 200,
      notification,
      files
    })
  } 
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

const getSideItems = async (req, res, next) => {
  try {
    let sides = await notificationDao.getSideItems()
    sides = utils.transformRes(sides.data)
    utils.formatDate('publishTime', sides, 'yyyy.MM.dd')
    res.send({
      code: 200,
      data: sides
    })  
  } 
  catch (err) {
    console.log()
  }
}


let controller = {
  getNotifications,
  getNotification,
  getSideItems
}

module.exports = controller