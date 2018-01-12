const queryHelper = require('../utils/DBQuery')

let getAllProjects = () => {
  const projectSql = 'select * from project'
  return queryHelper.queryPromise(projectSql)
}

let addProject = project => {
  const sql = 'insert into project set ?'
  return queryHelper.queryPromise(sql, project)
}

let dao = {
  getAllProjects
}

module.exports = dao