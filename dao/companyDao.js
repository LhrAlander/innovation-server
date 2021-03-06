const queryHelper = require('../utils/DBQuery')
const db = require('../utils/DBHelper')

// 获取信息数量
let getCount = filter => {
  const sql = `select count(*) as number from (select user.user_id as userId,user.user_name as principalName,user.account_state as status,user.user_phone as principalPhone,user.user_sex as gender,user.user_mail as email,company.company_phone as companyAccess,company.company_name as companyName,company.company_address as specAddress from company left join user on company.user_id=user.user_id order by user.account_state desc) as t ${filter ? 'where ' + filter : ''}`
  return queryHelper.queryPromise(sql, null)

}

// 获取所有的企业信息
let getAllCompanies = (pageNum, pageSize, filter) => {
  const sql = `select * from (select user.user_id as userId,user.user_name as principalName,user.account_state as status,user.user_phone as principalPhone,user.user_sex as gender,user.user_mail as email,company.company_phone as companyAccess,company.company_name as companyName,company.company_address as specAddress from company left join user on company.user_id=user.user_id order by user.account_state desc) as t ${filter ? 'where ' + filter : ''} limit ${(pageNum - 1) * pageSize}, ${pageSize}`
  return queryHelper.queryPromise(sql, null)
}

// 增加企业信息
let addCompany = company => {
  return new Promise(async (resolve, reject) => {
    await db.getConnection(async (err, connection) => {
      if (err) {
        resolve({
          code: 500,
          msg: '获取数据库链接失败'
        })
      }
      else {
        try {
          await connection.beginTransaction()
          let user = {
            user_id: company.user_id,
            user_name: company.user_name,
            user_identity: '企业',
            user_pwd: '123456',
            account_state: '可用'
          }
          let res1 = await queryHelper.queryPromise('insert into user set ?', user, connection)
          let res2 = await queryHelper.queryPromise(`insert into company set user_id = ?, user_name = ?, company_name = ?`, [company.user_id, company.user_name, company.company_name], connection)
          let res3 = await queryHelper.queryPromise(`insert into teacher set user_id = ?, user_name = ?, is_teacher=0`, [company.user_id, company.user_name])
          await connection.commit()
          connection.release()
          resolve({
            code: 200,
            msg: '增加用户信息成功'
          })
        }
        catch (error) {
          console.log('出错了，准备回滚', error)
          await connection.rollback(() => {
            console.log('回滚成功')
            connection.release()
          });
          resolve({
            code: 500,
            msg: '增加用户信息失败'
          })
        }
      }
    })
  })
}

// 修改企业信息
let changeCompany = company => {
  const sql = 'update company set ? where user_id = ?'
  return queryHelper.queryPromise(sql, [company, company.user_id])
}

// 获取特定企业信息
let getCompany = companyId => {
  const sql = 'select user.user_id, user.user_name, user.user_sex, user.user_mail, user.user_phone, user.account_state, company.company_name, company.company_phone, company.company_principal, company.company_address from user, company where user.user_id = company.user_id and company.user_id = ?'
  return queryHelper.queryPromise(sql, companyId)
}

let dao = {
  getAllCompanies,
  addCompany,
  changeCompany,
  getCompany,
  getCount
}

module.exports = dao