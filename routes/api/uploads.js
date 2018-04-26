const express = require('express')
const router = express.Router()
const projectDao = require('../../dao/projectDao')
const path = require('path')
const multer = require('multer')
const config = require('../../config')
const controller = require('../../controller/uploadController')


/**
 * 动态地生成上传中间件
 * @param {*获取上传路径} key 
 * @param {*表单中的name属性} name 
 */
let getUpload = (key, name) => {
  const storage = multer.diskStorage({
    destination: config.uploadPath[key],
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
  const upload = multer({
    storage: storage
  }).single(name)
  return upload
}


// 获取项目上传中间件
const projectUpload = getUpload('project', 'uploadFile')
// 获取政策信息上传中间件
const policyUpload = getUpload('policy', 'uploadFile')
// 获取通知公告上传中间件
const notificationUpload = getUpload('notification', 'uploadFile')
// 获取政策制度上传中间件
const fileSystemUpload = getUpload('fileSystem', 'uploadFile')
// 获取招募信息上传中间件
const recruitmentUpload = getUpload('recruitment', 'uploadFile')


// 上传项目材料
router.post('/project', projectUpload, controller.uploadProjectFiles)
// 上传政策材料
router.post('/policy', policyUpload, controller.uploadPolicyFiles)
// 上传通知公告材料
router.post('/notification', notificationUpload, controller.uploadNotificationFiles)
// 上传政策制度材料
router.post('/fileSystem', fileSystemUpload, controller.uploadfileSystemFiles)
// 上传招募信息材料
router.post('/recruitment', recruitmentUpload, controller.uploadRecruitmentFiles)

module.exports = router