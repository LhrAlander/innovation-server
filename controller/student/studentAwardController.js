const awardDao = require('../../dao/awardDao')
const utils = require('../../utils/util')
// 获取学生端获奖信息
let getAwards = async (req, res, next) => {
  try {
    const userId = req.user.userId
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    if ("name" in param) {
      param.awardName = param.name
      delete param.name
    }
    if ("awardLevel" in param) {
      param.awardCategory = param.awardLevel
      delete param.awardLevel
    }
    if ("awardSecondLevel" in param) {
      param.awardLevel = param.awardSecondLevel
      delete param.awardSecondLevel
    }
    let filter = utils.obj2MySql(param)
    let count = await awardDao.studentAwardCount(userId, filter)
    console.log(count)
    count = count.data[0].number
    let awards = await awardDao.getAwardsByStudent(userId, pageNum, pageSize, filter)
    utils.formatDate(['awardTime'], awards.data, 'yyyy-MM-dd')
    if (awards.code == 200) {
      res.send({
        code: 200,
        data: awards.data,
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
let controller = {
  getAwards
}
module.exports = controller