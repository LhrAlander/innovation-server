const projectDao = require('../../dao/projectDao')
const utils = require('../../utils/util')
// 获取学生端项目信息
let getProjects = async (req, res, next) => {
  try {
    const userId = req.user.userId
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await projectDao.studentProjectCount(userId, filter)
    count = count.data[0].number
    let projects = await projectDao.getProjectsByStudent(userId, pageNum, pageSize, filter)
    if (projects.code == 200 && projects.data.length > 0) {
      res.send({
        code: 200,
        data: projects.data,
        count: count
      })
    }
    else {
      res.status(500).send('查询失败')
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

// 获取项目展开信息
let getExpandInfoById = async (req, res, next) => {
  try {
    const { projectId } = req.body
    let values = await projectDao.getExpandInfoById(projectId)
    if (values.code == 200 && values.data.length > 0) {
      values.data.projectId = projectId
      utils.formatDate(['applyYear', 'beginYear', 'deadlineYear'], values.data, 'yyyy-MM-dd')
      res.send({
        code: 200,
        data: values.data
      })
    }
    else {
      throw new Error('查询失败')
    }

  } 
  catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

let controller = {
  getProjects,
  getExpandInfoById
}

module.exports = controller