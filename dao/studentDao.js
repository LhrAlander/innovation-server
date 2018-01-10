const queryHelper = require('../utils/DBQuery')

// 获取所有的学生信息
let getAllStudents = () => {
  const sql = 'select user.user_id, user.user_name, user.user_sex, user.user_mail, user.user_phone, user.account_state, student.student_academy, student.student_major, student.student_class from user, student where user.user_id = student.user_id'
  return queryHelper.queryPromise(sql, null)
}

// 增加学生信息
let addStudent = student => {
  const sql = 'insert into student set ?'
  return queryHelper.queryPromise(sql, student)
}

// 修改学生信息
let changeStudent = student => {
  const sql = 'update student set ? where user_id = ?'
  return queryHelper.queryPromise(sql, [student, student.user_id])
}

// 获取特定学生信息
let getStudent = userId => {
  const sql = 'select user.user_id, user.user_name, user.user_sex, user.user_mail, user.user_phone, user.account_state, student.student_academy, student.student_major, student.student_class from user, student where user.user_id = student.user_id and user.user_id = ?'
  return queryHelper.queryPromise(sql, userId)
}

let dao = {
  getAllStudents,
  addStudent,
  changeStudent,
  getStudent
}

module.exports = dao