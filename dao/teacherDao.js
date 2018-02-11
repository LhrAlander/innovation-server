const queryHelper = require('../utils/DBQuery')

// 获取信息数量
let getCount = filter => {
  if (filter) {
    let sql = `select count(*) as number from (select teacher.* from teacher left join user on user.user_id = teacher.user_id where ${filter} and account_state not like '%删除%' ) as t`
    return queryHelper.queryPromise(sql, null)
  }
  else {
    let sql = `select count(*) as number from (select teacher.* from teacher left join user on user.user_id = teacher.user_id where account_state not like '%删除%') as t`
    return queryHelper.queryPromise(sql, null)
  }
}

// 获取所有的教师信息
let getAllTeachers = (pageNum, pageSize, filter) => {
  // const sql = `select user.user_id, user.user_name, user.user_sex, user.user_mail, user.user_phone, user.account_state, teacher.teacher_degree, teacher.teacher_bachelor, teacher.teacher_major from user, teacher where user.user_id = teacher.user_id limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  const sql = `select user.*, teacher.teacher_bachelor, teacher.teacher_degree, teacher.teacher_major from teacher left join user on user.user_id = teacher.user_id where ${filter != null ? filter + ' and ' : ''} account_state not like '%删除%' limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  console.log(sql)
  return queryHelper.queryPromise(sql, null)
}

// 增加教师信息
let addTeacher = teacher => {
  const sql = 'insert into teacher set ?'
  return queryHelper.queryPromise(sql, teacher)
}

// 修改教师信息
let changeTeacher = teacher => {
  const sql = 'update teacher set ? where user_id = ?'
  return queryHelper.queryPromise(sql, [teacher, teacher.user_id])
}

// 获取特定教师信息
let getTeacher = userId => {
  const sql = 'select user.user_id, user.user_name, user.user_sex, user.user_mail, user.user_phone, user.account_state, teacher.teacher_degree, teacher.teacher_bachelor, teacher.teacher_major from user, teacher where user.user_id = teacher.user_id and user.user_id = ?'
  return queryHelper.queryPromise(sql, userId)
}

let dao = {
  getAllTeachers,
  addTeacher,
  changeTeacher,
  getTeacher,
  getCount
}

module.exports = dao