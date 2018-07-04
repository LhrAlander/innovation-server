const express = require('express')
const router = express.Router()
const controller = require('../../controller/front/projectsController')

router.get('/projects', controller.getProjects)
router.post('/project', controller.getProject)
router.get('/side', controller.getSideItems)
router.post('/pendProjects', controller.getAllPendProjects)
router.post('/pendProject', controller.getPendProjectById)
router.get('/pendSide', controller.getPendSideItems)

module.exports = router