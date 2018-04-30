const utils = require('../../utils/util')
const policyDao = require('../../dao/front/policyDao')
const countDao = require('../../dao/policyDao')

const getPolicys = async (req, res, next) => {
  try {
    const { pageNum, pageSize } = req.query
    let filter = `status='可用'`
    let count = await countDao.getCount(filter)
    count = count.data[0].number
    let policys = await policyDao.getAllPolicys(pageNum, pageSize)
    policys.data.forEach(p => {
      if (p.introduction) {
        p.introduction = p.introduction.replace(/<[^>]+>/g,"")
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
      count,
      policys: policys.data
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

const getPolicy = async (req, res, next) => {
  try {
    const policyId = req.body.policyId
    let policy = await policyDao.getPolicyById(policyId)
    utils.formatDate('publishTime', policy.data, 'yyyy-MM-dd')
    policy = policy.data[0]
    policy.introduction = policy.introduction == '' ? '暂无政策简介信息' : policy.introduction
    let files = await countDao.getFile(policyId)
    files = utils.transformRes(files.data)
    console.log(files)
    res.send({
      policy,
      files
    })
  } 
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

const getSideItems = async (req, res, next) => {
  try {
    let sides = await policyDao.getSideItems()
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
  getPolicys,
  getPolicy,
  getSideItems
}

module.exports = controller