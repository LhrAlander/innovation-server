const queryHelper = require('../../utils/DBQuery')

let getAward = () => {
	const sql = `select award.* from (select distinct award_id from award_user) as t left join award on award.award_id=t.award_id order by award_time desc limit 0, 15`
	return queryHelper.queryPromise(sql, null)
}

let getAwardProjects = () => {
	const sql = `select award.*, t.award_project from (select distinct award.award_id, award_project, award.award_time from award_user left join award on award.award_id = award_user.award_id where award_project!='个人' order by award_time desc) as t left join award on award.award_id=t.award_id`
	return queryHelper.queryPromise(sql, null)
}

let getAwardUsers = () => {
	const sql = `select award.*, user.user_name from award_user left join award on award.award_id=award_user.award_id left join user on user.user_id=award_user.user_id where award_project='个人' order by award_time desc`
	return queryHelper.queryPromise(sql, null)
}

let getProjectUsers = projectId => {
	const sql = `select user_name from project_student left join user on user.user_id=project_student.user_id where project_student.is_in_service=1 and project_id=?`
	return queryHelper.queryPromise(sql, projectId)
}

const dao = {
	getAward,
	getAwardProjects,
	getAwardUsers,
	getProjectUsers
}
module.exports = dao