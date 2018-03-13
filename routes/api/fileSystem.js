const express = require('express')
const router = express.Router()
const controller = require('../../controller/fileSystemController')

// 获取所有的政策制度
router.get('/files', controller.getAllFiles)
// 获取一个政策制度
router.post('/file', controller.getFile)
// 删除政策制度材料
router.post('/delete/files', controller.deleteFiles)
// 修改政策制度信息
router.post('/change/file', controller.updateFileSystem)
// 增加政策制度信息
router.post('/add/fileSystem', controller.addFileSystem)

module.exports = router