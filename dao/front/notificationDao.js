const queryHelper = require('../../utils/DBQuery')
const getAllNotifications = (pageNum, pageSize) => {
  const sql = `select notification_id as id,notification_title as title,publish_time as publishTime,notification_introduction as introduction from notification where state='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const getNotificationById = notificationId => {
  const sql = `select notification_title as title,notification_introduction as introduction,publish_time as publishTime, publish_user as author from notification where notification_id = ? and state='可用'`
  return queryHelper.queryPromise(sql, notificationId)
}

const getSideItems = () => {
  const sql = `select notification_id, notification_title, publish_time from notification where state='可用' order by publish_time desc limit 0, 3`
  return queryHelper.queryPromise(sql, null)
}

const dao = {
  getAllNotifications,
  getNotificationById,
  getSideItems
}
module.exports = dao