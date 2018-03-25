const express = require('express')
const router = express.Router()
const controller = require('../../controller/front/fileSystemController')

router.get('/fileSystems', controller.getFileSystems)
router.post('/files', controller.getFileSystem)

module.exports = router