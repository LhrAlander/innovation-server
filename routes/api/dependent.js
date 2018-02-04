const express = require('express')
const router = express.Router()
const controller = require('../../controller/dependentController')

// 获取所有的依托单位信息
router.get('/dependents', controller.getAllDependents)
// 修改一个依托单位信息
router.post('/change/dependent', controller.changeDependent)
// 添加一个依托单位信息
router.post('/add/dependent', controller.addDependent)
// 查找一个依托单位信息
router.post('/dependent', controller.getDependent)

module.exports = router