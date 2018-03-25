const utils = require('../../utils/util')
const projectDao = require('../../dao/front/projectDao')
const countDao = require('../../dao/projectDao')

const getProjects = async (req, res, next) => {
  try {
    const { pageNum, pageSize } = req.query
    let filter = `project_status='可用'`
    let count = await countDao.getCount(filter)
    count = count.data[0].number
    let projects = await projectDao.getAllProjects(pageNum, pageSize)
    projects.data.forEach(p => {
      p.introduce = p.introduce || '暂无项目简介'
    })
    res.send({
      count,
      projects: projects.data
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

const getProject = async (req, res, next) => {

}


let controller = {
  getProjects,
  getProject
}

module.exports = controller