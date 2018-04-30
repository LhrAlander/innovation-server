const utils = require('../../utils/util')
const recruitmentDao = require('../../dao/front/recruitmentDao')
const dao = require('../../dao/recruitmentDao')
const countDao = require('../../dao/teamDao')

/**
 * 前端获取所有的招募信息列表
 * 1、获取所有可用的招募信息
 * 2、根据时间排序
 * 3、 返回
 */
const getRecruitments = async (req, res, next) => {
  try {
    const { pageNum, pageSize } = req.body
    let recruitments = await recruitmentDao.getAllRecruitments(pageNum, pageSize)
    let count = await recruitmentDao.getAllRecruitmentsCount()
    count = count.data[0].number
    recruitments = utils.transformRes(recruitments.data)
    utils.formatDate("publishTime", recruitments, "yyyy-MM-dd")
    console.log(recruitments)
    recruitments.forEach(p => {
      if (p.introduction) {
        p.introduction = p.introduction.replace(/<[^>]+>/g, "")
      }
      else {
        p.introduction = p.title
      }
      let date = new Date(p.publishTime)
      p.day = date.getDay();
      p.yearMonth = `${date.getFullYear()}.${date.getMonth()}`
      delete p.publishTime
    })
    res.send({
      code: 200,
      data: recruitments,
      count
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

/**
 * 前端获取某一招募信息的详情
 */
const getRecruitment = async (req, res, next) => {
  try {
    const { id } = req.body
    let recruitment = await dao.getRecruitmentById(id)
    recruitment = utils.transformRes(recruitment.data)
    utils.formatDate(["publishTime", "endTime"], recruitment, "yyyy-MM-dd")
    let files = await dao.getRecruitmentFilesById(id)
    files = utils.transformRes(files.data)
    files.forEach(file => {
      file.name = file.fileName
      file.status = true
    })
    console.log(recruitment, files)
    res.send({
      code: 200,
      recruitment: recruitment[0],
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

const getSideItems = async (req, res, next) => {
  try {
    let sides = await recruitmentDao.getSideItems()
    sides = utils.transformRes(sides.data)
    utils.formatDate('publishTime', sides, 'yyyy.MM.dd')
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
  getRecruitments,
  getRecruitment,
  getSideItems
}

module.exports = controller