const dao = require('../dao/companyDao')
const countHelper = require('../utils/DBQuery')
const utils = require('../utils/util')

// 获取所有企业信息
let getAllCompanies = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    utils.camel2_(param)
    let filter = utils.obj2MySql(param)
    console.log(filter)
    let count = await dao.getCount(filter)
    count = count.data[0].number
    let responseData = []
    let companies = await dao.getAllCompanies(pageNum, pageSize, filter)
    if (companies.code == 200) {
      companies = utils.transformRes(companies.data)
      companies.forEach((company, index) => {
        responseData.push({
          userId: company.userId,
          id: index,
          companyName: company.companyName,
          principalName: company.companyPrincipal,
          companyAccess: company.companyPhone,
          status: company.accountState,
          principalPhone: company.userPhone,
          gender: company.userSex,
          email: company.userMail,
          specAddress: company.companyAddress
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

// 增加企业信息
let addCompany = (req, res, next) => {
  const { userId, userName, companyName, phone, principal, address } = req.body
  dao.addCompany({
    user_id: userId,
    user_name: userName,
    company_name: companyName,
    company_phone: phone,
    company_principal: principal,
    company_address: address
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

// 修改企业信息
let changeCompany = (req, res, next) => {
  let company = req.body.company
  company = utils.camel2_(company)
  dao.changeCompany(company)
    .then(values => {
      if (values.code == 200) {
        res.send(values)
      }
    })
    .catch(err => {
      res.send(err)
    })
}

// 获取特定企业信息
let getCompany = (req, res, next) => {
  const userId = req.body.userId
  dao.getCompany(userId)
    .then(values => {
      if (values.code == 200) {
        console.log(values)
        values.data = utils.transformRes(values.data)
        res.send(values)
      }
    })
    .catch(err => {
      res.send(err)
    })
}

let controller = {
  getAllCompanies,
  addCompany,
  changeCompany,
  getCompany
}

module.exports = controller