const express = require('express')
const router = express.Router()
const controller = require('../../controller/front/policyController')

router.get('/policys', controller.getPolicys)
router.post('/policy', controller.getPolicy)

module.exports = router