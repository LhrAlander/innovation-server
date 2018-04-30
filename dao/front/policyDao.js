const queryHelper = require('../../utils/DBQuery')
const getAllPolicys = (pageNum, pageSize) => {
  const sql = `select policy_id as policyId,policy_title as title,policy.publish_time as publishTime,policy_introduction as introduction from policy where state='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const getPolicyById = policyId => {
  const sql = `select publish_time as publishTime,publish_user as author,policy_introduction as introduction,policy_title as title from policy where policy_id=? and state='可用'`
  return queryHelper.queryPromise(sql, policyId)
}

const getSideItems = () => {
  const sql = `select policy_id, policy_title, publish_time from policy where state='可用' order by publish_time desc limit 0, 3`
  return queryHelper.queryPromise(sql, null) 
}
const dao = {
  getAllPolicys,
  getPolicyById,
  getSideItems
}
module.exports = dao