const queryHelper = require('../utils/DBQuery')
const config = require('../config')

const getCount = filter => {
	const sql = `select count(*) as number from (select * from recruitment where ${filter ? filter + ' and ' : ''} state not like '%删除%') as t`
	return queryHelper.queryPromise(sql)
}

const getRecruitments = (filter, pageNum, pageSize) => {
	const sql = `select * from recruitment where ${filter ? filter + ' and ' : ''} state not like '%删除%' order by publish_time desc limit ${(pageNum - 1) * pageSize}, ${pageSize}`
	return queryHelper.queryPromise(sql, null)
}

const getSignupCount = filter => {
	const sql = `select count(*) as number from (select user_name, title, sign_up_time, recruitment_sign_up.state from recruitment_sign_up left join recruitment on recruitment.id = recruitment_sign_up.recruitment_id left join user on user.user_id=recruitment_sign_up.user_id where ${filter ? filter + ' and ' : ''} recruitment_sign_up.state not like '删除') as t`
	return queryHelper.queryPromise(sql, null)
}

const getSingUps = (filter, pageNum, pageSize) => {
	const sql = `select recruitment_sign_up.id, user_name, title, sign_up_time, recruitment_sign_up.state from recruitment_sign_up left join recruitment on recruitment.id = recruitment_sign_up.recruitment_id left join user on user.user_id=recruitment_sign_up.user_id where ${filter ? filter + ' and ' : ''} recruitment_sign_up.state not like '删除' order by sign_up_time desc limit  ${(pageNum - 1) * pageSize}, ${pageSize}`
	return queryHelper.queryPromise(sql, null)
}

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

const changeSignup = (id, info) => {
	const sql = `update recruitment_sign_up set ? where id = ?`
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

const uploadSignupFile = file => {
	try {
    const sql = `insert into recruitment_sign_up_files set ?`
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
	console.log(sql)
  return queryHelper.queryPromise(sql, path)
}
const deleteSignupFile = path => {
	const sql = `delete from recruitment_sign_up_files where file_path = ?`
	console.log(sql)
  return queryHelper.queryPromise(sql, path)
}

const addRecruitment = info => {
	const sql = `insert into recruitment set ?`
  return queryHelper.queryPromise(sql, info)
}

const getSignupById = id => {
	const sql = `select user.user_id,title,recruitment.end_time,recruitment_sign_up.state,recruitment_sign_up.introduction,recruitment_sign_up.sign_up_time, user.user_name from recruitment_sign_up left join recruitment on recruitment.id=recruitment_sign_up.recruitment_id left join user on user.user_id=recruitment_sign_up.user_id where recruitment_sign_up.id=?`
	return queryHelper.queryPromise(sql, id)
}

const getSignupFiles = id => {
	const sql =`select * from recruitment_sign_up_files where sign_up_id=?`
	return queryHelper.queryPromise(sql, id)
}

const getRecruitmentBySignup = id => {
	const sql = `select recruitment.end_time from recruitment_sign_up left join recruitment on recruitment.id=recruitment_sign_up.recruitment_id where recruitment_sign_up.id=?`
	return queryHelper.queryPromise(sql, id)
}

const changeRecruitmentSignup = (id, info) => {
	const sql = `update recruitment_sign_up set ? where id = ?`
	return queryHelper.queryPromise(sql, [info, id])
}

const getOptions = today => {
	const sql = `select * from recruitment where end_time > ? and state='可用'`
	return queryHelper.queryPromise(sql, today)
}

const addSignup = info => {
	const sql = `insert into recruitment_sign_up set ?`
	return queryHelper.queryPromise(sql, info)
}

let dao = {
	getCount,
	getSignupCount,
	getRecruitments,
	getSingUps,
	getRecruitmentById,
	getRecruitmentFilesById,
	changeRecruitment,
	changeSignup,
	uploadFile,
	uploadSignupFile,
	deleteFile,
	deleteSignupFile,
	addRecruitment,
	getSignupById,
	getSignupFiles,
	getRecruitmentBySignup,
	changeRecruitmentSignup,
	getOptions,
	addSignup
}
module.exports = dao