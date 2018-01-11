const express = require('express')
const router = express.Router()
const controller = require('../../controller/categoryController')
// 获取所有用户类别
router.get('/users', controller.getAllUserCategories)
// 删除用户类别
router.post('/delete/users', controller.deleteUserCategory)
// 添加用户类别
router.post('/add/users', controller.addUserCategory)

// 获取所有项目级别
router.get('/project/levels', controller.getAllProjectLevels)
// 删除项目级别
router.post('/delete/project/levels', controller.deleteProjectLevel)
// 添加项目级别
router.post('/add/project/levels', controller.addProjectLevel)

// 获取所有项目类别
router.get('/project/categories', controller.getAllProjectCategories)
// 删除项目类别
router.post('/delete/project/categories', controller.deleteProjectCategory)
// 添加项目类别
router.post('/add/project/categories', controller.addProjectCategory)

// 获取所有团队类别
router.get('/team/categories', controller.getAllTeamCategories)
// 删除团队类别
router.post('/delete/team/categories', controller.deleteTeamCategory)
// 添加团队类别
router.post('/add/team/categories', controller.addTeamCategory)


// 获取所有获奖级别
router.get('/award/levels', controller.getAllAwardLevels)
// 删除获奖级别
router.post('/delete/award/levels', controller.deleteAwardLevel)
// 添加获奖级别
router.post('/add/award/levels', controller.addAwardLevel)

// 获取所有获奖类别
router.get('/award/categories', controller.getAllAwardCategories)
// 删除获奖类别
router.post('/delete/award/categories', controller.deleteAwardCategory)
// 添加获奖类别
router.post('/add/award/categories', controller.addAwardCategory)

// 获取所有政策类别
router.get('/policy/categories', controller.getAllPolicyCategories)
// 删除政策类别
router.post('/delete/policy/categories', controller.deletePolicyCategory)
// 添加政策类别
router.post('/add/policy/categories', controller.addPolicyCategory)

// 获取所有依托单位类别
router.get('/dependent/categories', controller.getAllDependentCategories)
// 删除依托单位类别
router.post('/delete/dependent/categories', controller.deleteDependentCategory)
// 添加依托单位类别
router.post('/add/dependent/categories', controller.addDependentCategory)

// 获取所有状态类别
router.get('/state/categories', controller.getAllStateCategories)
// 删除状态类别
router.post('/delete/state/categories', controller.deleteStateCategory)
// 添加状态类别
router.post('/add/state/categories', controller.addStateCategory)

module.exports = router