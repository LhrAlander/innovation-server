const dao = require('../dao/teacherDao')
const countHelper = require('../utils/DBQuery')
const utils = require('../utils/util')

// 获取所有教师信息
let getAllTeachers = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    let count = await countHelper.getTableCount('teacher')
    count = count.data[0].number
    let responseData = []
    let teachers = await dao.getAllTeachers(pageNum, pageSize)
    if (teachers.code == 200) {
      teachers = utils.transformRes(teachers.data)
      teachers.forEach((teacher, index) => {
        console.log(teacher)
        responseData.push({
          teacherId: teacher.userId,
          name: teacher.userName,
          phone: teacher.userPhone,
          status: teacher.accountState,
          background: teacher.teacherDegree,
          degree: teacher.teacherBachelor,
          specialty: teacher.teacherMajor,
          gender: teacher.userSex,
          email: teacher.userMail
        })
      })
      res.send({
        code: 200,
        data: responseData,
        count: count
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
  dao.getAllTeachers()
    .then(values => {
      if (values.code == 200) {
        res.send(values)
      }
    })
    .catch(err => {
      res.send(err)
    })
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
  dao.changeTeacher({
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

let controller = {
  getAllTeachers,
  addTeacher,
  changeTeacher,
  getTeacher
}

module.exports = controller