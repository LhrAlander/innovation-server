const queryHelper = require('../../utils/DBQuery')
const getAllPolicys = (pageNum, pageSize) => {
  const sql = `select policy_id as policyId,policy_title as title,policy.publish_time as publishTime,policy_introduction as introduction from policy where state='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const getPolicyById = policyId => {
  const sql = `select publish_time as publishTime,publish_user as author,policy_introduction as introduction,policy_title as title from policy where policy_id=? and state='可用'`
  return queryHelper.queryPromise(sql, policyId)
}

const dao = {
  getAllPolicys,
  getPolicyById
}
module.exports = dao