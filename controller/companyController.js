const dao = require('../dao/companyDao')

// 获取所有企业信息
let getAllCompanies = (req, res, next) => {
  dao.getAllCompanies()
    .then(values => {
      if (values.code == 200) {
        res.send(values)
      }
    })
    .catch(err => {
      res.send(err)
    })
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
  const { userId, userName, companyName, phone, principal, address } = req.body
  dao.changeCompany({
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

// 获取特定企业信息
let getCompany = (req, res, next) => {
  const userId = req.body.userId
  dao.getCompany(userId)
    .then(values => {
      if (values.code == 200) {
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