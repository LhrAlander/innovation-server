const db = require('../utils/DBHelper')
const queryHelper = require('../utils/DBQuery')

// 获取所有学院
let getAllAcademy = function () {
  const sql = 'select distinct academy from academy where status = "可用"'
  return queryHelper.queryPromise(sql, null)
}

// 获取学院下特定专业
let getMajorByAcademy = function (academy) {
  const sql = `select major from major where academy = '${academy}' and status = "可用"`
  return queryHelper.queryPromise(sql, null)
}

// 获取专业下特定班级
let getClassByMajor = function (major) {
  const sql = 'select _class from class_table where major = ?'
  return queryHelper.queryPromise(sql, major)
}

// 删除班级
let deleteClass = function (major, _class) {
  if (_class == null) {
    const sql = 'delete from class_table where major = ?'
    return queryHelper.queryPromise(sql, major)
  }
  else {
    const sql = 'delete from class_table where major = ? and _class = ?'
    return queryHelper.queryPromise(sql, [major, _class])
  }
}

// 删除专业
let deleteMajor = function (academy, major) {
  if (major != null) {
    const sql = 'update major set status = "不可用" where academy = ? and major = ?'
    return queryHelper.queryPromise(sql, [academy, major])
  }
  else {
    const sql = 'update major set status = "不可用" where academy = ?'
    return queryHelper.queryPromise(sql, academy)
  }
}

// 删除学院
let deleteAcademy = function (academy) {
  const sql = 'update academy set status = "不可用" where academy = ?'
  return queryHelper.queryPromise(sql, academy)
}

// 从数据库中删除学院
let deleteAcademyFromDB = function (academy) {
  const delSql = 'delete from academy where academy = ?'
  return queryHelper.queryPromise(delSql, academy)
}

// 从数据库中删除专业
let deleteMajorFromDB = function (academy, major) {
  const delSql = 'delete from major where academy = ? and major = ?'
  return queryHelper.queryPromise(delSql, [academy, major])
}

// 从数据库中删除班级
let deleteClassFromDB = function (major, _class) {
  const delSql = 'delete from class_table where major = ? and _class = ?'
  return queryHelper.queryPromise(delSql, [major, _class])
}

// 增加学院
let addAcademy = function (academy) {
  const addSql = 'insert into academy set academy = ?'
  return queryHelper.queryPromise(addSql, academy)
}

// 增加专业
let addMajor = function (academy, major) {
  const object = {
    academy: academy,
    major: major
  }
  const addSql = 'insert into major set ?'
  return queryHelper.queryPromise(addSql, object)
}

// 增加班级
let addClass = function (major, _class) {
  const object = {
    _class: _class,
    major: major
  }
  const addSql = 'insert into class_table set ?'
  return queryHelper.queryPromise(addSql, object)
}

// 获取所有状态
let getAllStatus = () => {
  const sql = 'select * from state_table'
  return queryHelper.queryPromise(sql, null)
}

// 增加状态
let addStatus = status => {
  const sql = 'insert into state_table set state_name = ?'
  return queryHelper.queryPromise(sql, status)
}

let delStatus = status => {
  const sql = 'delete from state_table where state_name = ?'
  return queryHelper.queryPromise(sql, status)
}

let baseInfoDao = {
  getAllAcademy,
  getMajorByAcademy,
  getClassByMajor,
  deleteClass,
  deleteMajor,
  deleteAcademy,
  deleteAcademyFromDB,
  deleteMajorFromDB,
  deleteClassFromDB,
  addAcademy,
  addMajor,
  addClass,
  getAllStatus,
  addStatus,
  delStatus
}

module.exports = baseInfoDao