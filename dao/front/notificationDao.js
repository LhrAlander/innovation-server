const queryHelper = require('../../utils/DBQuery')
const getAllNotifications = (pageNum, pageSize) => {
  const sql = `select notification_id as id,notification_title as title,publish_time as publishTime,notification_introduction as introduction from notification where state='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const dao = {
  getAllNotifications
}
module.exports = dao