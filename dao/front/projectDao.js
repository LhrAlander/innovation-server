const queryHelper = require('../../utils/DBQuery')
const getAllProjects = (pageNum, pageSize) => {
  const sql = `select p.project_id as projectId,p.project_name as projectName,p.project_introduce as introduce,p.team_id as teamId,t.team_name as teamName from project as p left join team as t on t.team_id=p.team_id where p.project_status='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const dao = {
  getAllProjects
}
module.exports = dao