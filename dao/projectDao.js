const queryHelper = require('../utils/DBQuery')
const config = require('../config')

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
 * 查找一个项目,包括项目材料附件
 * @param {*项目的ID} projectId 
 */
let getProject = async projectId => {
  try {
    const sql = 'select * from project where project_id = ?'
    let project = await queryHelper.queryPromise(sql, projectId)
    if (project.code == 200 && project.data.length > 0) {
      const uploadFileSql = 'select * from project_files where project_id = ?'
      let files = await queryHelper.queryPromise(uploadFileSql, projectId)
      let regFiles = []     // 项目申请材料
      let finishFiles = []  // 项目结题材料
      if (files.code == 200) {
        files = files.data
        files.forEach(file => {
          if (file.file_type == config.projectFile.REG_FILE) {
            regFiles.push(JSON.parse(JSON.stringify(file)))
          }
          else {
            finishFiles.push(JSON.parse(JSON.stringify(file)))
          }
        })
      }
      return {
        code: 200,
        project: project.data,
        regFiles,
        finishFiles
      }
    }
    else {
      throw new Error('不存在该项目!')
    }
  }
  catch (err) {
    console.log(err)
    return {
      code: 500,
      msg: err.msg || err.message
    }
  }
}

/**
 * 获取所有的项目成员
 */
let getAllUsers = () => {
  const sql = 'select * from project_student'
  return queryHelper.queryPromise(sql, null)
}


let dao = {
  getAllProjects,
  addProject,
  updateProject,
  getProject,
  getAllUsers
}

module.exports = dao