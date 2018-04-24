const utils = require('../../utils/util')
const notificationDao = require('../../dao/notificationDao')
const teamDao = require('../../dao/teamDao')
const policyDao = require('../../dao/policyDao')
const fileDao = require('../../dao/fileSystemDao')

const getNotifications = async (req, res, next) => {
  try {
    /**
     * 对数组对象进行归档操作
     * @param {*需要被归档的数组对象} array 
     */
    let arch = array => {
      let results = []
      let currentDate = ''
      let currentArray = []
      array.forEach(obj => {
        if (currentDate != obj.publish_time) {
          results.push({
            date: currentDate,
            items: currentArray
          })
          currentArray = []
          currentDate = obj.publish_time
        }
        currentArray.push({
          title: obj.notification_title,
          id: obj.notification_id
        })
      })
      results.push({
        date: currentDate,
        items: currentArray
      })
      results.shift()
      return results
    }
    let notifications = await notificationDao.getAllNotifications(1, 30)
    utils.formatDate('publish_time', notifications.data, 'yyyy/MM/dd')
    let responseData = arch(notifications.data)
    res.send({
      data: responseData
    })

  }
  catch (err) {
    console.log(err)
    res.status(500).send('服务器错误')
  }
}

const geTeams = async (req, res, next) => {
  try {
    let teams = await teamDao.getTeamsForIndex(1, 6)
    let responseData = teams.data.map(team => {
      return {
        teamId: team.team_id,
        teamName: team.team_name,
        teamIntroduce: team.team_introduction
      }
    })
    res.send({
      data: responseData
    })
  }
  catch (err) {
    res.status(500).send('查询失败')
  }
}

const getPolicys = async (req, res, next) => {
  try {
    let policys = await policyDao.getAllPolicys(1, 9, `status='可用'`)
    res.send(policys)
  }
  catch (err) {
    res.status(500).send('查询失败')
  }

}

const getFileSystems = async (req, res, next) => {
  try {
    const files = await fileDao.getFilesForIndex()
    console.log(files)
    res.send(files)
  }
  catch (err) {
    res.status(500).send('查询失败')
  }
}

let controller = {
  getNotifications,
  geTeams,
  getPolicys,
  getFileSystems
}

module.exports = controller