const baseInfoDao = require('../dao/baseInfoDao')

// 获取所有学院信息
let getAllAcademy = (req, res, next) => {
  console.log("进入到controller层")
  baseInfoDao.getAllAcademy()
    .then(results => {
      if (results.code == 200) {
        delete results.msg
        res.send(results)
      }
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}

// 查询特定学院下的所有专业
let getMajorByAcademy = (req, res, next) => {
  const academy = req.body.academy
  baseInfoDao.getMajorByAcademy(academy)
    .then(results => {
      if (results.code == 200) {
        delete results.msg
        res.send(results)
      }
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}

// 查询特定专业下的所有班级
let getClassByMajor = (req, res, next) => {
  const major = req.body.major
  baseInfoDao.getClassByMajor(major)
    .then(results => {
      if (results.code == 200) {
        delete results.msg
        res.send(results)
      }
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}

// 删除班级
let deleteClass = (req, res, next) => {
  const major = req.body.major
  const _class = req.body._class
  baseInfoDao.deleteClass(major, _class)
    .then(results => {
      if (results.code == 200) {
        delete results.msg
        res.send(results)
      }
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}

// 删除专业
let deleteMajor = (req, res, next) => {
  const academy = req.body.academy
  const major = req.body.major
  baseInfoDao.deleteMajor(academy, major)
    .then(results => {
      if (results.code == 200) {
        delete results.msg
        res.send(results)
      }
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}

// 删除学院
let deleteAcademy = (req, res, next) => {
  const academy = req.body.academy
  baseInfoDao.deleteAcademy(academy)
    .then(results => {
      if (results.code == 200) {
        delete results.msg
        return baseInfoDao.deleteMajor(academy)
      }
    })
    .then(results => {
      console.log(results)
      delete results.msg
      res.send(results)
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}

// 增加学院
let addAcademy = (req, res, next) => {
  const academy = req.body.academy
  baseInfoDao.deleteAcademyFromDB(academy)
    .then(results => {
      if (results.code == 200) {
        return baseInfoDao.addAcademy(academy)
      }
    })
    .then(results => {
      delete results.msg
      res.send(results)
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}

// 增加专业
let addMajor = (req, res, next) => {
  const { academy, major } = req.body
  baseInfoDao.deleteMajorFromDB(academy, major)
    .then(results => {
      if (results.code == 200) {
        return baseInfoDao.addMajor(academy, major)
      }
    })
    .then(results => {
      delete results.msg
      res.send(results)
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}


// 增加班级
let addClass = (req, res, next) => {
  const { _class, major } = req.body
  baseInfoDao.deleteClassFromDB(major, _class)
    .then(results => {
      if (results.code == 200) {
        return baseInfoDao.addClass(major, _class)
      }
    })
    .then(results => {
      delete results.msg
      res.send(results)
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}


let baseInfoController = {
  getAllAcademy,
  getMajorByAcademy,
  getClassByMajor,
  deleteClass,
  deleteMajor,
  deleteAcademy,
  addAcademy,
  addMajor,
  addClass,
}

module.exports = baseInfoController