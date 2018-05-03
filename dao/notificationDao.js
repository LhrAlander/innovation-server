const queryHelper = require('../utils/DBQuery')
const config = require('../config')
// 获取信息数量
let getCount = filter => {
  if (filter) {
    let sql = `select count(*) as number from (select * from notification where ${filter} and state not like '%删除%' ) as t`
    return queryHelper.queryPromise(sql, null)
  }
  else {
    let sql = `select count(*) as number from notification where state not like '%删除%'`
    return queryHelper.queryPromise(sql, null)
  }
}

// 获取所有的通知公告信息
let getAllNotifications = (pageNum, pageSize, filter) => {
  let sql = `select * from notification where ${ filter ? filter + ' and ' : ''} state not like "%删除%" order by publish_time desc limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql, null)
}

// 获取一个通知公告
let getNotification = notificationId => {
  const sql =  `select * from notification where notification_id = ? and state not like '%删除%'`
  return queryHelper.queryPromise(sql, notificationId)
}

// 获取一个通知公告的附件
let getFilesByNotification = notificationId => {
  const sql =  `select * from notification_files where notification_id = ?`
  return queryHelper.queryPromise(sql, notificationId)
}

/**
 * 
 * @param {*需要修改的字段值} payload 
 * @param {*需要修改的政策的ID} notification_id 
 */
let updateNotification = (payload, notification_id) => {
  const sql = 'update notification set ? where notification_id = ?'
  return queryHelper.queryPromise(sql, [payload, notification_id])
}

let uploadFile = file => {
  try {
    const sql = `insert into notification_files set ?`
    return queryHelper.queryPromise(sql, file)  
  } 
  catch (err) {
    console.log('上传政策材料失败',  err)
  }
}

/**
 * 删除文件信息
 * @param {*文件对象} files 
 */
let deleteFile = path => {
  const sql = `delete from notification_files where file_path = ?`
  return queryHelper.queryPromise(sql, path)
}

let addNotification = notification => {
  const sql = `insert into notification set ?`
  return queryHelper.queryPromise(sql, notification)
}

let deleteNotification = id => {
  const sql = `delete from notification where notification_id = ?`
  return queryHelper.queryPromise(sql, id)
}

let getFilesById = id => {
  const sql = `select file_path as filePath from notification_files where notification_id = ?`
  return queryHelper.queryPromise(sql, id)
}


let dao = {
  getCount,
  getAllNotifications,
  getNotification,
  getFilesByNotification,
  uploadFile,
  deleteFile,
  updateNotification,
  addNotification,
  deleteNotification,
  getFilesById
}
module.exports = dao