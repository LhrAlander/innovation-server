const express = require('express')
const router = express.Router()
const controller = require('../../controller/dependentController')

// 获取级联选择信息
router.get('/choices', controller.getSelectors)
// 获取所有的依托单位信息
router.get('/dependents', controller.getAllDependents)
// 修改一个依托单位信息
router.post('/change/dependent', controller.changeDependent)
// 添加一个依托单位信息
router.post('/add/dependent', controller.addDependent)
// 查找一个依托单位信息
router.post('/dependent', controller.getDependent)
// 删除一个依托单位
router.post('/del/dependent', controller.delDependent)
// 获取所有地单位人员进行选择
router.get('/leader/choices', controller.getLeaderChoices)

module.exports = router