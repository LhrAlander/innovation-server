const queryHelper = require('../utils/DBQuery')

/**
 * 获取所有的项目信息
 */
let getAllProjects = () => {
  const projectSql = 'select * from project'
  return queryHelper.queryPromise(projectSql)
}

/**
 * 添加一个项目
 * @param {*项目模型对象} project 
 */
let addProject = project => {
  const sql = 'insert into project set ?'
  return queryHelper.queryPromise(sql, project)
}

/**
 * 修改一个项目的信息
 * @param {*需要修改的字段值} payload 
 * @param {*需要修改的项目的ID} projectId 
 */
let updateProject = (payload, projectId) => {
  const sql = 'update project set ? where project_id = ?'
  return queryHelper.queryPromise(sql, [payload, projectId])
}

/**
 * 查找一个项目
 * @param {*项目的ID} projectId 
 */
let getProject = async projectId => {
  const sql = 'select * from project where project_id = ?'
  let project = await queryHelper.queryPromise(sql, projectId)
  if (project.code == 200 && project.data.length > 0) {
    const uploadFileSql = 'select * from '
  }
  else {
    return {
      code: 500,
      msg: '不存在该项目'
    }
  }
}

let dao = {
  getAllProjects,
  addProject,
  updateProject,
  getProject
}

module.exports = dao