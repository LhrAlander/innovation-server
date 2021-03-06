const projectDao = require('../dao/projectDao')
const policyDao = require('../dao/policyDao')
const notificationDao = require('../dao/notificationDao')
const fileSystemDao = require('../dao/fileSystemDao')
const recruitmentDao = require('../dao/recruitmentDao')
const teamDao = require('../dao/teamDao')

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

// 上传通知公告材料
let uploadNotificationFiles = (req, res, next) => {
  try {
    const file = req.file
    console.log(req.body)
    // 上传成功
    if (file != null) {
      // 构建数据库表对象
      const sqlValue = {
        notification_id: req.body.notificationId,
        file_path: `./${file.path}`,
        file_name: file.originalname
      }
      console.log(sqlValue)
      notificationDao.uploadFile(sqlValue)
        .then(values => {
          console.log(values)
          res.send({
            code: 200,
            fileName: file.originalname,
            filePath: sqlValue.file_path
          })
        })
        .catch(err => {
          console.log(err)
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

// 上传政策制度材料
let uploadfileSystemFiles = (req, res, next) => {
  try {
    const file = req.file
    console.log(req.body)
    // 上传成功
    if (file != null) {
      // 构建数据库表对象
      const sqlValue = {
        file_system_id: req.body.fileSystemId,
        file_path: `./${file.path}`,
        file_name: file.originalname
      }
      console.log(sqlValue)
      fileSystemDao.uploadFile(sqlValue)
        .then(values => {
          console.log(values)
          res.send({
            code: 200,
            fileName: file.originalname,
            filePath: sqlValue.file_path
          })
        })
        .catch(err => {
          console.log(err)
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

// 上传招募信息材料
let uploadRecruitmentFiles = (req, res, next) => {
  try {
    const file = req.file
    console.log(req.body)
    // 上传成功
    if (file != null) {
      // 构建数据库表对象
      const sqlValue = {
        recruitment_id: req.body.id,
        file_path: `./${file.path}`,
        file_name: file.originalname
      }
      console.log(sqlValue)
      recruitmentDao.uploadFile(sqlValue)
        .then(values => {
          console.log(values)
          res.send({
            code: 200,
            fileName: file.originalname,
            filePath: sqlValue.file_path
          })
        })
        .catch(err => {
          console.log(err)
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

// 上传报名信息材料
let uploadSignupFiles = (req, res, next) => {
  try {
    const file = req.file
    console.log(req.body)
    // 上传成功
    if (file != null) {
      // 构建数据库表对象
      const sqlValue = {
        sign_up_id: req.body.id,
        file_path: `./${file.path}`,
        file_name: file.originalname
      }
      console.log(sqlValue)
      recruitmentDao.uploadSignupFile(sqlValue)
        .then(values => {
          console.log(values)
          res.send({
            code: 200,
            fileName: file.originalname,
            filePath: sqlValue.file_path
          })
        })
        .catch(err => {
          console.log(err)
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

// 上传报名信息材料
let uploadPendProjectFiles = (req, res, next) => {
  try {
    const file = req.file
    console.log(req.body)
    // 上传成功
    if (file != null) {
      // 构建数据库表对象
      const sqlValue = {
        project_id: req.body.id,
        file_path: `./${file.path}`,
        file_name: file.originalname
      }
      console.log(sqlValue)
      projectDao.uploadPendProjectFiles(sqlValue)
        .then(values => {
          console.log(values)
          res.send({
            code: 200,
            fileName: file.originalname,
            filePath: sqlValue.file_path
          })
        })
        .catch(err => {
          console.log(err)
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

const uploadTeamPhotos = (req, res, next) => {
  try {
    const file = req.file
    console.log(file)
    // 上传成功
    if (file != null) {
      // 构建数据库表对象
      const sqlValue = {
        team_id: req.body.teamId,
        file_path: `./${file.path}`,
        file_name: file.originalname,
        display_name: file.filename
      }
      teamDao.uploadTeamPhotos(sqlValue)
        .then(values => {
          console.log(values)
          res.send({
            code: 200,
            fileName: file.originalname,
            filePath: sqlValue.file_path
          })
        })
        .catch(err => {
          console.log(err)
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
  uploadPolicyFiles,
  uploadNotificationFiles,
  uploadfileSystemFiles,
  uploadRecruitmentFiles,
  uploadSignupFiles,
  uploadPendProjectFiles,
  uploadTeamPhotos
}

module.exports = controller