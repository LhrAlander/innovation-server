const utils = require('../../utils/util')
const notificationDao = require('../../dao/notificationDao')
const teamDao = require('../../dao/teamDao')
const policyDao = require('../../dao/policyDao')
const fileDao = require('../../dao/fileSystemDao')
const userDao = require('../../dao/userDao')
const studentDao = require('../../dao/studentDao')
const config = require('../../config/index')

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
    for (let i = 0; i < responseData.length; i++) {
      let t = responseData[i]
      let photos = await teamDao.getTeamPhotosById(t.teamId)
      if (photos.data.length > 0) {
        t.photo = `${config.imgPath}/uploads/teamPhotos/${photos.data[0].display_name}`
      }
    }
    res.send({
      data: responseData
    })
  }
  catch (err) {
    console.log(err)
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

const reg = async (req, res, next) => {
  try {
    const { user, student } = req.body
    let u = await userDao.searchUser(user.user_id)
    console.log('查找用户',u)
    if (u.code == 200 && u.data.length > 0) {
      res.send({
        code: 100,
        msg: '已存在该用户'
      })
    }
    else {
      let v = await userDao.regUser(user)
      v = await studentDao.addStudent(student)
      if (v.code == 200) {
        res.send({
          code: 200,
          message: '注册成功'
        })
      }
      else {
        throw new Error()
      }
    }
  } 
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '注册失败'
    })
  }
}

let controller = {
  getNotifications,
  geTeams,
  getPolicys,
  getFileSystems,
  reg
}

module.exports = controller