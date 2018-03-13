const queryHelper = require('../utils/DBQuery')


let getDegrees = () => {
  const sql = `select distinct teacher_degree as degree from teacher where teacher_degree!='NULL'`
  return queryHelper.queryPromise(sql, null)
}

let getBachelors = () => {
  const sql = ` select distinct teacher_bachelor as background from teacher where teacher_bachelor!='NULL'`
  return queryHelper.queryPromise(sql)
}

let getMajors = () => {
  const sql =  `select teacher_major as specialty from teacher where teacher_major!='NULL'`
  return queryHelper.queryPromise(sql)
}

// 获取信息数量
let getCount = filter => {
  let sql = `select count(*) as number from (select user.user_id as teacherId,user.user_name as name,user.user_phone as phone,user.account_state as status,user.user_sex as gender,user.user_mail as email,teacher.teacher_degree as degree,teacher.teacher_bachelor as background,teacher.teacher_major as specialty from teacher left join user on teacher.user_id=user.user_id) as t ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql, null)
}

// 获取所有的教师信息
let getAllTeachers = (pageNum, pageSize, filter) => {
  const sql = `select * from (select user.user_id as teacherId,user.user_name as name,user.user_phone as phone,user.account_state as status,user.user_sex as gender,user.user_mail as email,teacher.teacher_degree as degree,teacher.teacher_bachelor as background,teacher.teacher_major as specialty from teacher left join user on teacher.user_id=user.user_id order by user.account_state desc) as t ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
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
  getCount,
  getDegrees,
  getBachelors,
  getMajors
}

module.exports = dao