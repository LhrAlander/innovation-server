const dao = require('../dao/studentDao')
const countHelper = require('../utils/DBQuery')
const utils = require('../utils/util')

// 获取所有学生信息
let getAllStudents = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let filter = utils.obj2MySql(param)
    console.log(param)
    let count = await dao.getCount(filter)
    count = count.data[0].number
    console.log(count)
    let responseData = []
    let students = await dao.getAllStudents(pageNum, pageSize, filter)
    if (students.code == 200) {
      students = utils.transformRes(students.data)
      students.forEach((student, index) => {
        responseData.push({
          id: index + 1,
          studentId: student.userId,
          name: student.userName,
          status: student.accountState,
          phone: student.userPhone,
          email: student.userMail,
          institute: student.studentAcademy,
          specialty: student.studentMajor,
          class: student.studentClass,
          gender: student.userSex,
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
  try {
    let { student } = req.body
    student = utils.camel2_(student)
    console.log(student)
    dao.changeStudent(student)
      .then(values => {
        if (values.code == 200) {
          res.send(values)
        }
      })
      .catch(err => {
        res.send(err)
      })
  }
  catch (err) {
    console.log(err)
  }

}

// 获取特定学生信息
let getStudent = (req, res, next) => {
  const userId = req.body.userId
  dao.getStudent(userId)
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
  getAllStudents,
  addStudent,
  changeStudent,
  getStudent
}

module.exports = controller