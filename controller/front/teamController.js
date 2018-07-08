const utils = require('../../utils/util')
const teamDao = require('../../dao/front/teamDao')
const photoDao = require('../../dao/teamDao')
const countDao = require('../../dao/teamDao')
const config = require('../../config/index')

const getTeams = async (req, res, next) => {
  try {
    const { pageNum, pageSize } = req.query
    let filter = `status='可用'`
    let count = await countDao.getCount(filter)
    count = count.data[0].number
    let teams = await teamDao.getAllTeams(pageNum, pageSize)
    teams.data.forEach(p => {
      if (p.introduction) {
        p.introduction = p.introduction.replace(/<[^>]+>/g, "")
      }
      else {
        p.introduction = '暂无团队简介'
      }
    })

    for (let i = 0; i < teams.data.length; i++) {
      let p = teams.data[i]
      let photos = await photoDao.getTeamPhotosById(p.teamId)
      console.log(photos)
      p.photo = `${config.imgPath}/uploads/teamPhotos/${photos.data[0].display_name}`
    }
    console.log(teams.data)

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
      sts.data.push({ userName: team.data[0].leaderName })
    }
    team = team.data[0]
    if (team.introduction == '' || !team.introduction) {
      team.introduction = '<h2>暂无团队简介</h2>'
    }
    console.log(sts.data)
    team.students = sts.data.map(st => {
      return st.userName
    })
    let photos = await photoDao.getTeamPhotosById(teamId)
    photos = photos.data.map(p => {
      return `${config.imgPath}/uploads/teamPhotos/${p.display_name}`
    })
    team.photos = photos
    console.log(team)
    res.send(team)
  }
  catch (err) {
    console.log(err)
  }
}

const getSideTeams = async (req, res, next) => {
  try {
    let teams = await teamDao.getSideTeams()
    teams = utils.transformRes(teams.data)
    res.send({
      code: 200,
      data: teams
    })
  }
  catch (err) {
    console.log(err)
  }
}


let controller = {
  getTeams,
  getTeam,
  getSideTeams
}

module.exports = controller