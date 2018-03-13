const queryHelper = require('../utils/DBQuery')
const config = require('../config')
// 获取信息数量
let getCount = filter => {
  if (filter) {
    let sql = `select count(*) as number from (select * from file_system where ${filter} and state not like '%删除%' ) as t`
    return queryHelper.queryPromise(sql, null)
  }
  else {
    let sql = `select count(*) as number from file_system where state not like '%删除%'`
    return queryHelper.queryPromise(sql, null)
  }
}


// 获取所有的政策制度信息
let getAllFiles = (pageNum, pageSize, filter) => {
  let sql = `select * from file_system where ${ filter ? filter + ' and ' : ''} state not like "%删除%" limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql, null)
}

// 获取一个政策制度
let getFileSystem = fileSystemId => {
  const sql =  `select * from file_system where file_system_id = ? and state not like '%删除%'`
  return queryHelper.queryPromise(sql, fileSystemId)
}

// 获取一个政策制度的附件
let getFilesByFileSystem = fileSystemId => {
  const sql =  `select * from file_system_files where file_system_id = ?`
  return queryHelper.queryPromise(sql, fileSystemId)
}


let updateFileSystem = (payload, file_system_id) => {
  try {
    const sql = 'update file_system set ? where file_system_id = ?'
    return queryHelper.queryPromise(sql, [payload, file_system_id])  
  } 
  catch (err) {
    console.log('上传政策制度失败',  err)
  }
}

/**
 * 删除文件信息
 * @param {*文件对象} files 
 */
let deleteFile = path => {
  const sql = `delete from file_system_files where file_path = ?`
  return queryHelper.queryPromise(sql, path)
}


let uploadFile = file => {
  try {
    const sql = `insert into file_system_files set ?`
    return queryHelper.queryPromise(sql, file)  
  } 
  catch (err) {
    console.log('上传政策材料失败',  err)
  }
}

let addFileSystem = info => {
  const sql = `insert into file_system set ?`
  return queryHelper.queryPromise(sql, info)
}

let dao = {
  getCount,
  getAllFiles,
  getFileSystem,
  getFilesByFileSystem,
  updateFileSystem,
  deleteFile,
  uploadFile,
  addFileSystem
}
module.exports = dao