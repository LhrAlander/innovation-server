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
  try {
    const teamId = req.body.teamId
    let team = await teamDao.getTeamById(teamId)  
    let sts = await teamDao.getStudentsByTeam(teamId)
    if (sts.data.length == 0) {
      sts.data.push({userName: team.data[0].leaderName})
    }
    team = team.data[0]
    if (team.introduction == '' || !team.introduction) {
      team.introduction = '<h2>暂无团队简介</h2>'
    }
    console.log(sts.data)
    team.students = sts.data.map(st => {
      return st.userName
    })
    res.send(team)
  } 
  catch (err) {
    console.log(err)
  }
}


let controller = {
  getTeams,
  getTeam
}

module.exports = controller