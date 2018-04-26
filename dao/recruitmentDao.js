const queryHelper = require('../utils/DBQuery')
const config = require('../config')

/**
 * 根据ID获取招募基本信息
 * @param {招募信息id} id 
 */
const getRecruitmentById = id => {
	const sql = `select * from recruitment where id = ?`
	return queryHelper.queryPromise(sql, id)
}
/**
 * 根据ID获取招募附件信息
 * @param {招募信息id} id 
 */
const getRecruitmentFilesById = id => {
	const sql = `select * from recruitment_files where recruitment_id = ?`
	return queryHelper.queryPromise(sql, id)
}
/**
 * 根据id更改招募信息
 * @param {招募信息id} id 
 * @param {招募信息} info 
 */
const changeRecruitment = (id, info) => {
	const sql = `update recruitment set ? where id=?`
	return queryHelper.queryPromise(sql, [info, id])
}

const uploadFile = file => {
  try {
    const sql = `insert into recruitment_files set ?`
    return queryHelper.queryPromise(sql, file)  
  } 
  catch (err) {
		console.log('上传招募信息材料失败',  err)
		return {
			code: 500,
			msg: '上传材料失败'
		}
	}
}

const deleteFile = path => {
	const sql = `delete from recruitment_files where file_path = ?`
  return queryHelper.queryPromise(sql, path)
}

const addRecruitment = info => {
	const sql = `insert into recruitment set ?`
  return queryHelper.queryPromise(sql, info)
}



let dao = {
	getRecruitmentById,
	getRecruitmentFilesById,
	changeRecruitment,
	uploadFile,
	deleteFile,
	addRecruitment
}
module.exports = dao