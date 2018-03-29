const queryHelper = require('../../utils/DBQuery')
const getAllFileSystems = (pageNum, pageSize) => {
  const sql = `select file_system_id as id,title,publish_time as publishTime,introduction from file_system where state='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const getFileSystemById = fileSystemId => {
  const sql = `select title,publish_user as author,publish_time as publishTime,introduction from file_system where file_system_id=? and state='可用'`
  return queryHelper.queryPromise(sql, fileSystemId)
}

const dao = {
  getAllFileSystems,
  getFileSystemById
}
module.exports = dao