const queryHelper = require('../utils/DBQuery')

// 获取所有的企业信息
let getAllCompanies = (pageNum, pageSize) => {
  const sql = `select user.user_id, user.user_name, user.user_sex, user.user_mail, user.user_phone, user.account_state, company.company_name, company.company_phone, company.company_principal, company.company_address, company.company_id from user, company where user.user_id = company.user_id limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql, null)
}

// 增加企业信息
let addCompany = company => {
  const sql = 'insert into company set ?'
  return queryHelper.queryPromise(sql, company)
}

// 修改企业信息
let changeCompany = company => {
  const sql = 'update company set ? where user_id = ?'
  return queryHelper.queryPromise(sql, [company, company.user_id])
}

// 获取特定企业信息
let getCompany = companyId => {
  const sql = 'select user.user_id, user.user_name, user.user_sex, user.user_mail, user.user_phone, user.account_state, company.company_name, company.company_phone, company.company_principal, company.company_address, company.company_id from user, company where user.user_id = company.user_id and company.company_id = ?'
  return queryHelper.queryPromise(sql, companyId)
}

let dao = {
  getAllCompanies,
  addCompany,
  changeCompany,
  getCompany
}

module.exports = dao