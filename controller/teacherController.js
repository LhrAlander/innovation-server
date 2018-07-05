const dao = require('../dao/teacherDao')
const countHelper = require('../utils/DBQuery')
const utils = require('../utils/util')


// 获取教师学位信息
let getSelectors = async (req, res, next) => {
  try {
    Promise.all([dao.getDegrees(), dao.getBachelors(), dao.getMajors()])
      .then(value => {
        let degree = value[0].data.map(i => {
          return {
            label: i.degree,
            value: i.degree
          }
        })
        let background = value[1].data.map(i => {
          return {
            label: i.background,
            value: i.background
          }
        })
        let specialty = value[2].data.map(i => {
          return {
            label: i.specialty,
            value: i.specialty
          }
        })
        res.send({
          code: 200,
          degree,
          background,
          specialty
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  catch (err) {

  }
}

// 获取所有教师信息
let getAllTeachers = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    let count = await dao.getCount(filter)
    count = count.data[0].number
    let teachers = await dao.getAllTeachers(pageNum, pageSize, filter)
    if (teachers.code == 200) {
      res.send({
        code: 200,
        data: teachers.data,
        count
      })
    }
    else {
      throw new Error('未能找到')
    }
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: err.message || err.msg
    })
  }
}

// 增加教师信息
let addTeacher = (req, res, next) => {
  const { userId, userName, degree, bachelor, major } = req.body
  dao.addTeacher({
    user_id: userId,
    user_name: userName,
    teacher_degree: degree,
    teacher_bachelor: bachelor,
    teacher_major: major
  })
    .then(values => {
      if (values.code == 200) {
        res.send(values)
      }
    })
    .catch(err => {
      res.send(err)
    })
}

// 修改教师信息
let changeTeacher = (req, res, next) => {
  const { userId, userName, degree, bachelor, major } = req.body
  let teacher = req.body.teacher
  teacher = utils.camel2_(teacher)
  dao.changeTeacher(teacher)
    .then(values => {
      if (values.code == 200) {
        res.send(values)
      }
    })
    .catch(err => {
      res.send(err)
    })
}

// 获取特定教师信息
let getTeacher = (req, res, next) => {
  const userId = req.body.userId
  console.log(userId)
  dao.getTeacher(userId)
    .then(values => {
      if (values.code == 200) {
        values.data = utils.transformRes(values.data)
        res.send(values)
      }
    })
    .catch(err => {
      res.send(err)
    })
}

// 查询教师名字形成选项
const getTeacherNames = async (req, res, next) => {
  try {
    let names = await dao.getTeacherNames()
    console.log(names)
    names = names.data.map(n => {
      return {
        label: n.user_name,
        value: n.user_id,
        userPhone: n.user_phone
      }
    })
    res.send({
      code: 200,
      names
    })
  } 
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '查询信息失败'
    })  
  }
}

let controller = {
  getSelectors,
  getAllTeachers,
  addTeacher,
  changeTeacher,
  getTeacher,
  getTeacherNames
}

module.exports = controller