const queryHelper = require('../utils/DBQuery')
const config = require('../config')

// 获取所有的政策信息
let getAllPolicys = () => {
  const sql = 'select * from policy'
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
  getAllPolicys,
  updatePolicy,
  getPolicy,
  getFile,
  uploadFile,
  deleteFile
}

module.exports = policyDao