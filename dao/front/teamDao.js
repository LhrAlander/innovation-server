const queryHelper = require('../../utils/DBQuery')
const getAllTeams = (pageNum, pageSize) => {
  const sql = `select team_id as teamId,team_name as teamName,team_introduction as introduction from team where team_state='可用' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql)
}

const dao = {
  getAllTeams
}
module.exports = dao