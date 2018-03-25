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

}


let controller = {
  getPolicys,
  getPolicy
}

module.exports = controller