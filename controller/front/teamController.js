const utils = require('../../utils/util')
const teamDao = require('../../dao/front/teamDao')
const countDao = require('../../dao/teamDao')

const getTeams = async (req, res, next) => {
  try {
    const { pageNum, pageSize } = req.query
    let filter = `status='可用'`
    let count = await countDao.getCount(filter)
    count = count.data[0].number
    let teams = await teamDao.getAllTeams(pageNum, pageSize)
    teams.data.forEach(p => {
      if (p.introduction) {
        p.introduction = p.introduction.replace(/<[^>]+>/g,"")
      }
      else {
        p.introduction = '暂无团队简介'
      }
    })
    res.send({
      count,
      teams: teams.data
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

const getTeam = async (req, res, next) => {

}


let controller = {
  getTeams,
  getTeam
}

module.exports = controller