const express = require('express')
const router = express.Router()
const controller = require('../../controller/front/awardController')

router.get('/awards', controller.getAwards)
router.post('/users', controller.getAwardUsers)

module.exports = router