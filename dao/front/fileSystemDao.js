const queryHelper = require('../../utils/DBQuery')
const getAllFileSystems = (pageNum, pageSize) => {
  const sql = `select file_system_id as id,title,publish_time as publishTime,introduction from file_system where state='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const dao = {
  getAllFileSystems
}
module.exports = dao