const dao = require('../dao/studentDao')

// 获取所有学生信息
let getAllStudents = (req, res, next) => {
  dao.getAllStudents()
    .then(values => {
      if (values.code == 200) {
        res.send(values)
      }
    })
    .catch(err => {
      res.send(err)
    })
}

// 增加学生信息
let addStudent = (req, res, next) => {
  const { userId, userName, academy, major, _class } = req.body
  dao.addStudent({
    user_id: userId,
    user_name: userName,
    student_academy: academy,
    student_major: major,
    student_class: _class
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

// 修改学生信息
let changeStudent = (req, res, next) => {
  const { userId, userName, academy, major, _class } = req.body
  dao.changeStudent({
    user_id: userId,
    user_name: userName,
    student_academy: academy,
    student_major: major,
    student_class: _class
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

// 获取特定学生信息
let getStudent = (req, res, next) => {
  const userId = req.body.userId
  dao.getStudent(userId)
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
  getAllStudents,
  addStudent,
  changeStudent,
  getStudent
}

module.exports = controller