const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const config = require('../../config')


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


// 上传项目材料
router.post('/project', projectUpload, (req, res, next) => {
  try {
    const file = req.file
    res.send({
      code: 200,
      downloadName: file.filename,
      fileName: file.originalname
    })
  }
  catch(err) {
    res.send({
      code: 500,
      msg: '上传文件失败!'
    })
  }
})


module.exports = router