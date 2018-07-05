const queryHelper = require('../../utils/DBQuery')
const getAllProjects = (pageNum, pageSize) => {
  const sql = `select p.project_id as projectId,p.project_name as projectName,p.project_introduce as introduce,p.team_id as teamId,t.team_name as teamName from project as p left join team as t on t.team_id=p.team_id where p.project_status='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const getProjectByProjectId = projectId => {
  const sql = `select project_name as projectName,project_id as projectId,project_introduce as projectIntroduction,start_year as projectTime from project where project_id='${projectId}'`
  return queryHelper.queryPromise(sql)
}

const getSideItems = () => {
  const sql = `select project_id, project_name from project order by register_year desc limit 0, 3`
  return queryHelper.queryPromise(sql)
}

const getAllPendProjectsCount = () => {
  const sql = `select count(*) as number from pend_project where status != '不可用'`
  return queryHelper.queryPromise(sql)
}

const getAllPendProjects = (pageNum, pageSize) => {
  const sql = `select * from pend_project where status != '不可用' order by apply_year desc  limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const getPendProjectById = id => {
  const sql = `select * from pend_project where id = ?`
  return queryHelper.queryPromise(sql, id)
}

const getPendSideItems = () => {
  const sql = `select id, project_category,project_level, apply_year from pend_project order by apply_year desc limit 0, 3`
  return queryHelper.queryPromise(sql)
}

const dao = {
  getAllProjects,
  getProjectByProjectId,
  getSideItems,
  getAllPendProjects,
  getAllPendProjectsCount,
  getPendProjectById,
  getPendSideItems
}
module.exports = dao