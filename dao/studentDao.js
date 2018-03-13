const queryHelper = require('../utils/DBQuery')
// 获取信息数量
let getCount = filter => {
  let sql = `select count(*) as number from (select user.user_id as studentId,user.user_name as name,user.user_phone as phone,user.account_state as status,user.user_sex as gender,user.user_mail as email,student.student_academy as institute,student.student_major as specialty,student.student_class as class from student left join user on student.user_id=user.user_id) as t ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql)
}


// 获取所有的学生信息
let getAllStudents = (pageNum, pageSize, filter) => {
  const sql = `select * from (select user.user_id as studentId,user.user_name as name,user.user_phone as phone,user.account_state as status,user.user_sex as gender,user.user_mail as email,student.student_academy as institute,student.student_major as specialty,student.student_class as class from student left join user on student.user_id=user.user_id order by user.account_state desc) as t ${filter ? 'where ' + filter : '' } limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
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
  getStudent,
  getCount
}

module.exports = dao