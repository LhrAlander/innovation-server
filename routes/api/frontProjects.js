const express = require('express')
const router = express.Router()
const controller = require('../../controller/front/projectsController')

router.get('/projects', controller.getProjects)
router.post('/project', controller.getProject)

module.exports = router