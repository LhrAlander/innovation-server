const utils = require('../../utils/util')
const projectDao = require('../../dao/front/projectDao')
const countDao = require('../../dao/projectDao')
const fileDao = require('../../dao/projectDao')

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
  try {
    const projectId = req.body.projectId
    let project = await projectDao.getProjectByProjectId(projectId)
    project = project.data[0]
    project.projectIntroduction = project.projectIntroduction || '<h1>暂无项目简介</h1>'
    utils.formatDate('projectTime', [project], 'yyyy-MM-dd')
    res.send(project)
  }
  catch (err) {
    console.log(err)
  }

}

const getSideItems = async (req, res, next) => {
  try {
    let sides = await projectDao.getSideItems()
    sides = utils.transformRes(sides.data)
    res.send({
      code: 200,
      data: sides
    })
  }
  catch (err) {
    console.log()
  }
}

const getAllPendProjects = async (req, res, next) => {
  try {
    const { pageNum, pageSize } = req.body
    let projects = await projectDao.getAllPendProjects(pageNum, pageSize)
    projects = utils.transformRes(projects.data)
    let count = await projectDao.getAllPendProjectsCount()
    count = count.data[0].number
    utils.formatDate(["applyYear", "deadlineYear"], projects, "yyyy-MM-dd")
    console.log(projects)
    let p = projects.map(p => {
      if (!p.introduction) {
        p.introduction = '暂无介绍'
      }
      else {
        p.introduction = p.introduction.replace(/<[^>]+>/g, "")
      }
      let date = new Date(p.applyYear)
      p.day = date.getDay();
      p.yearMonth = `${date.getFullYear()}.${date.getMonth()}`
      return {
        day: p.day,
        yearMonth: p.yearMonth,
        deadlineYear: p.deadlineYear,
        introduction: p.introduction,
        title: p.projectName,
        id: p.id
      }
    })
    res.send({
      projects: p,
      count
    })
  }
  catch (err) {
    console.log(err)
  }
}

const getPendProjectById = async (req, res, next) => {
  try {
    let id = req.body.id
    let project = await projectDao.getPendProjectById(id)
    project = utils.transformRes(project.data)
    utils.formatDate(["applyYear", "deadlineYear"], project, "yyyy-MM-dd")
    project = project[0]
    project.introduction = project.introduce || '暂无介绍'
    let files = await fileDao.getPendProjectFilesById(project.id)
    files = utils.transformRes(files.data)
    files.forEach(file => {
      file.name = file.fileName
      file.status = true
    })
    res.send({
      code: 200,
      project,
      files
    })
  } 
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '查询失败'
    })
  }
}

const getPendSideItems = async (req, res, next) => {
  try {
    let sides = await projectDao.getPendSideItems()
    sides = utils.transformRes(sides.data)
    utils.formatDate('applyYear', sides, 'yyyy-MM-dd')
    res.send({
      code: 200,
      data: sides
    })
  }
  catch (err) {
    console.log()
  }
}


let controller = {
  getProjects,
  getProject,
  getSideItems,
  getAllPendProjects,
  getPendProjectById,
  getPendSideItems
}

module.exports = controller