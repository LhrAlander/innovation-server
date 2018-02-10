const queryHelper = require('../utils/DBQuery')
// 获取信息数量
let getCount = filter => {
  if (filter) {
    let sql = `select count(*) as number from (select student.* from student left join user on user.user_id = student.user_id where ${filter} and account_state not like '%删除%' ) as t`
    return queryHelper.queryPromise(sql, null)
  }
  else {
    let sql = `select count(*) as number from (select student.* from student left join user on user.user_id = student.user_id where account_state not like '%删除%') as t`
    return queryHelper.queryPromise(sql, null)
  }
}


// 获取所有的学生信息
let getAllStudents = (pageNum, pageSize, filter) => {
  // let sql = `select user.user_id, user.user_name, user.user_sex, user.user_mail, user.user_phone, user.account_state, student.student_academy, student.student_major, student.student_class from user, student where user.user_id = student.user_id limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  let sql = `select user.*, student.student_academy, student.student_major, student.student_class from student left join user on user.user_id = student.user_id where ${ filter ? filter : 'account_state not like "%删除%"'} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
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