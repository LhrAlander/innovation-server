const express = require('express')
const router = express.Router()
const controller = require('../../controller/policyController')

// 获取所有政策信息
router.get('/policys', controller.getAllPolicys)
// 修改政策信息
router.post('/change/policy', controller.updatePolicy)
// 增加政策信息
router.post('/add/policy', controller.addPolicy)
// 获取一个政策信息
router.post('/policy', controller.getPolicy)
// 删除材料附件
router.post('/delete/files', controller.deleteFiles)
module.exports = router