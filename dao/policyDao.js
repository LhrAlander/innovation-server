const queryHelper = require('../utils/DBQuery')
const config = require('../config')


// 获取信息数量
let getCount = filter => {
  let sql = `select count(*) as number from(select p.policy_identity as govCategory,p.policy_title as title,p.state as status,p.policy_id as policyId from policy as p) as t  ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql, null)
}
// 获取所有的政策信息
let getAllPolicys = (pageNum, pageSize, filter) => {
  const sql = `select * from (select p.policy_identity as govCategory,p.policy_title as title,p.state as status,p.policy_id as policyId from policy as p) as t ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql)
}

/**
 * 
 * @param {*需要修改的字段值} payload 
 * @param {*需要修改的政策的ID} policy_id 
 */
let updatePolicy = (payload, policy_id) => {
  const sql = 'update policy set ? where policy_id = ?'
  return queryHelper.queryPromise(sql, [payload, policy_id])
}

/**
 * 添加一个政策
 * @param {*政策信息} policy 
 */
let addPolicy = policy => {
  const sql = 'insert  into policy set ?'
  return queryHelper.queryPromise(sql, policy)
}

/**
 * 查找一个政策信息
 * @param {*政策ID} policyId 
 */
let getPolicy = policyId => {
  const sql = 'select * from policy where policy_id = ?'
  return queryHelper.queryPromise(sql, policyId)
}

// 获取项目材料
let getFile = policyId => {
  const sql = 'select * from policy_files where policy_id = ?'
  return queryHelper.queryPromise(sql, policyId)
}

let uploadFile = file => {
  try {
    const sql = `insert into policy_files set ?`
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
  const sql = `delete from policy_files where file_path = ?`
  return queryHelper.queryPromise(sql, path)
}

let policyDao = {
  getCount,
  getAllPolicys,
  updatePolicy,
  getPolicy,
  getFile,
  uploadFile,
  deleteFile
}

module.exports = policyDao