const dao = require('../dao/teacherDao')

// 获取所有教师信息
let getAllTeachers = (req, res, next) => {
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
  dao.getTeacher(userId)
    .then(values => {
      if (values.code == 200) {
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