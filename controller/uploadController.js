const projectDao = require('../dao/projectDao')
const policyDao = require('../dao/policyDao')

let uploadProjectFiles = (req, res, next) => {
  try {
    const file = req.file
    console.log(req.body)

    // 上传成功
    if (file != null) {
      // 构建数据库表对象
      const sqlValue = {
        project_id: req.body.projectId,
        file_path: `./${file.path}`,
        file_type: req.body.type,
        file_name: file.originalname
      }
      projectDao.uploadFile(sqlValue)
        .then(values => {
          console.log(values)
          res.send({
            code: 200,
            fileName: file.originalname,
            filePath: sqlValue.file_path
          })
        })
        .catch(err => {
          throw new Error('上传文件失败!')
        })

    }
    else {
      throw new Error('上传文件失败!')
    }
  }
  catch (err) {
    console.log('shangchuan err', err)
    res.send({
      code: 500,
      msg: '上传文件失败!'
    })
  }
}

let uploadPolicyFiles = (req, res, next) => {
  try {
    const file = req.file
    console.log(req.body)

    // 上传成功
    if (file != null) {
      // 构建数据库表对象
      const sqlValue = {
        policy_id: req.body.policyId,
        file_path: `./${file.path}`,
        file_name: file.originalname
      }
      console.log(sqlValue)
      policyDao.uploadFile(sqlValue)
        .then(values => {
          console.log(values)
          res.send({
            code: 200,
            fileName: file.originalname,
            filePath: sqlValue.file_path
          })
        })
        .catch(err => {
          throw new Error('上传文件失败!')
        })

    }
    else {
      throw new Error('上传文件失败!')
    }
  }
  catch (err) {
    console.log('shangchuan err', err)
    res.send({
      code: 500,
      msg: '上传文件失败!'
    })
  }
}

let controller = {
  uploadProjectFiles,
  uploadPolicyFiles
}

module.exports = controller