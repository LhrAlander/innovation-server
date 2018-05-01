const notificationDao = require('../dao/notificationDao')
const utils = require('../utils/util')


// 获取所有的通知公告
let getAllNotifications = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let _filter = utils.transforKey({
      category: 'notification_identity',
      title: 'notification_title',
      status: 'state',
      publisherName: 'publish_user',
      publishTime: 'publish_time'
    }, param)
    let filter = utils.obj2MySql(_filter)
    let count = await notificationDao.getCount(filter)
    count = count.data[0].number
    let responseData = []
    let notifications = await notificationDao.getAllNotifications(pageNum, pageSize, filter)
    if (notifications.code == 200) {
      notifications = utils.transformRes(notifications.data)
      utils.formatDate('publishTime', notifications, 'yyyy-MM-dd')
      notifications.forEach((item, index) => {
        responseData.push({
          id: index + 1,
          notificationId: item.notificationId,
          category: item.notificationIdentity,
          title: item.notificationTitle,
          publishTime: item.publishTime,
          publisherName: item.publishUser,
          status: item.state
        })
      })
      res.send({
        code: 200,
        data: responseData,
        count: count
      })
    }
    else {
      throw new Error('未能找到')
    }
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: err.message || err.msg
    })
  }
}

// 获取一个通知公告
let getNotification = async (req, res, next) => {
  try {
    const notificationId = req.body.notificationId
    let notification = await notificationDao.getNotification(notificationId)
    if (notification.code == 200) {
      notification = utils.transformRes(notification.data)[0]
      utils.formatDate('publishTime', [notification], 'yyyy-MM-dd')
      let files = await notificationDao.getFilesByNotification(notificationId)
      files = utils.transformRes(files.data)
      files.forEach(file => {
        file.name = file.fileName
        file.status = true
      })
      console.log(files)
      res.send({
        code: 200,
        data: notification,
        files: files
      })
    }
    else {
      throw new Error('未能找到该通知公告')
    }

  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: err.msg || err.message
    })
  }
}

// 修改一个通知公告
let updateNotification = async (req, res, next) => {
  try {
    let { notification } = req.body
    notification = utils.camel2_(notification)
    console.log(notification)
    const notificationId = notification.notification_id
    delete notification.notification_id
    notificationDao.updateNotification(notification, notificationId)
      .then(values => {
        res.send({
          code: 200,
          msg: '修改成功'
        })
      })
      .catch(err => {
        console.log(err)
        res.send({
          code: 500,
          msg: '修改失败'
        })
      })
  }
  catch (err) {
    console.log(err)
  }
}

let deleteFiles = async (req, res, next) => {
  let files = req.body.files
  try {
    let rmRes = await utils.rmFile(files)
    console.log(rmRes)
    for (let i = 0; i < rmRes.length; i++) {
      if (rmRes[i].code == 200) {
        let delRes = await notificationDao.deleteFile(rmRes[i].filePath)
        if (delRes.code != 200) {
          throw new Error('删除数据库失败')
        }
        console.log(delRes.code)
      }
    }
    console.log('success')
    res.send({
      code: 200,
      data: '删除材料成功'
    })
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      data: '删除材料失败'
    })
  }
}

// 增加一个通知公告
let addNotification = async (req, res, next) => {
  try {
    const { notification } = req.body
    notification.notification_id = utils.getId('notification')
    let values = await notificationDao.addNotification(notification)
    console.log(values)
    values.notificationId = notification.notification_id
    res.send(values)
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '增加通知公告失败'
    })
  }
}

let controller = {
  getAllNotifications,
  getNotification,
  deleteFiles,
  updateNotification,
  addNotification
}

module.exports = controller