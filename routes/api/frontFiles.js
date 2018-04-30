const express = require('express')
const router = express.Router()
const controller = require('../../controller/front/fileSystemController')

router.get('/fileSystems', controller.getFileSystems)
router.post('/file', controller.getFileSystem)
router.get('/side', controller.getSideItems)

module.exports = router