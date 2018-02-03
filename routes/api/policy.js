const express = require('express')
const router = express.Router()
const controller = require('../../controller/policyController')

// 获取所有政策信息
router.get('/policys', controller.getAllPolicys)

module.exports = router