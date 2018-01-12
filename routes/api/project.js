const express = require('express')
const router = express.Router()
const controller = require('../../controller/projectController')

router.get('/projects', controller.getAllProjects)
router.post('/add/project', controller.addProject)

module.exports = router
