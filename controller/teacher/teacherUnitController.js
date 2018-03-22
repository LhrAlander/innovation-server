const unitDao = require('../../dao/dependentDao')
const utils = require('../../utils/util')

const getUnits = async (req, res, next) => {
  try {
    const userId = req.user.userId
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await unitDao.teacherUnitCount(userId, filter)
    console.log(count)
    count = count.data[0].number
    let units = await unitDao.getUnitsByTeacher(userId, pageNum, pageSize, filter)
    if (units.code == 200) {
      res.send({
        code: 200,
        data: units.data,
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
  getUnits
}

module.exports = controller