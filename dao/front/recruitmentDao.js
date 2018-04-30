const queryHelper = require('../../utils/DBQuery')
const getAllRecruitments = (pageNum, pageSize) => {
  const sql = `select * from recruitment where state='可用' order by publish_time desc limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql)
}
const getAllRecruitmentsCount = () => {
	const sql = `select count(*) as number from recruitment where state='可用'`
	return queryHelper.queryPromise(sql)
}
const getRecruitmentById = teamId => {
  const sql = `select team_name as teamName,team_introduction as introduction,st.user_name as leaderName,st.user_phone as leaderPhone,th.user_name as teacherName,th.user_phone as teacherPhone from team left join user as st on st.user_id=team.team_principal left join user as th on th.user_id=team.team_teacher where team_id=?`
  return queryHelper.queryPromise(sql, teamId)
}

const getSideItems = () => {
  const sql = `select id, title, publish_time from recruitment where state='可用' order by publish_time desc limit 0, 3`
  return queryHelper.queryPromise(sql, null)
}

const dao = {
	getAllRecruitments,
	getAllRecruitmentsCount,
  getRecruitmentById,
  getSideItems
}
module.exports = dao