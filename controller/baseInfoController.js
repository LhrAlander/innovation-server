const baseInfoDao = require('../dao/baseInfoDao')

// 获取所有学院信息
let getAllAcademy = async (req, res, next) => {
  try {
    let academys = await baseInfoDao.getAllAcademy()
    academys = academys.data.map(a => {
      return {
        academy: a.academy
      }
    })
    for (let i = 0; i < academys.length; i++) {
      let a = academys[i]
      let majors = await baseInfoDao.getMajorByAcademy(a.academy)
      majors = majors.data.map(m => {
        return {
          major: m.major
        }
      })
      for (let j = 0; j < majors.length; j++) {
        let m = majors[j]
        let _classes = await baseInfoDao.getClassByMajor(m.major)
        _classes = _classes.data.map(c => {
          return {
            class: c._class
          }
        })
        m.classes = _classes
      }
      a.majors = majors
    }
    res.send({
      code: 200,
      data: academys
    })
  } 
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '查询失败'
    })
  }
}

// 更改学院名称
const changeAcademy = async (req, res, next) => {
  try {
    const { old, _new } = req.body
    let values = await baseInfoDao.getAcademy(old)
    if (values.data[0].number > 0) {
      values = await baseInfoDao.changeAcademy(old, _new)
      values = await baseInfoDao.changeAcademyForMajor(old, _new)
      if (values.code == 200) {
        res.send({
          code: 200,
          msg: '修改学院名称成功'
        })
      }
    }
    else {
      throw new Error('不存在该学院')
    }

  } 
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '修改学院失败'
    })
  }
}

// 更改专业名称
const changeMajor = async (req, res, next) => {
  try {
    const { old, _new } = req.body
    let values = await baseInfoDao.getMajor(old)
    if (values.data[0].number > 0) {
      values = await baseInfoDao.changeMajor(old, _new)
      values = await baseInfoDao.changeMajorForClass(old, _new)
      if (values.code == 200) {
        res.send({
          code: 200,
          msg: '修改专业名称成功'
        })
      }
    }
    else {
      throw new Error('不存在该专业')
    }
  } 
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '修改学院失败'
    })
  }
}


// 查询特定学院下的所有专业
let getMajorByAcademy = (req, res, next) => {
  const academy = req.body.academy
  baseInfoDao.getMajorByAcademy(academy)
    .then(results => {
      console.log(results)
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
  console.log(major, _class)
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
      return baseInfoDao.changeMajorForAcademy(academy)
    })
    .then(results => {
      delete results.msg
      res.send({
        code: 200,
        msg: '添加学院成功'
      })
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}

// 增加专业
let addMajor = (req, res, next) => {
  const { academy, major } = req.body
  console.log(academy, major)
  baseInfoDao.deleteMajorFromDB(academy, major)
    .then(results => {
      if (results.code == 200) {
        return baseInfoDao.addMajor(academy, major)
      }
    })
    .then(results => {
      delete results.msg
      res.send({
        code: 200,
        msg: '添加专业成功'
      })
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
      res.send({
        code: 200,
        msg: '增加班级成功'
      })
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}


let baseInfoController = {
  getAllAcademy,
  changeAcademy,
  getMajorByAcademy,
  getClassByMajor,
  changeMajor,
  deleteClass,
  deleteMajor,
  deleteAcademy,
  addAcademy,
  addMajor,
  addClass,
}

module.exports = baseInfoController