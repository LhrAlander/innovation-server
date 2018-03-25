const queryHelper = require('../../utils/DBQuery')
const getAllPolicys = (pageNum, pageSize) => {
  const sql = `select policy_id as policyId,policy_title as title,policy.publish_time as publishTime,policy_introduction as introduction from policy where state='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const dao = {
  getAllPolicys
}
module.exports = dao