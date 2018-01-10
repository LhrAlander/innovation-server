const express = require('express')
const router = express.Router()
const controller = require('../../controller/companyController')

// 企业路由
// 查询所有的企业信息
router.get('/companies', controller.getAllCompanies)

// 增加企业信息
router.post('/add/company', controller.addCompany)

// 修改企业信息
router.post('/change/company', controller.changeCompany)

// 查询特定企业信息
router.post('/company', controller.getCompany)

module.exports = router