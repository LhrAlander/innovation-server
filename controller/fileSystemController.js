const fileSystemDao = require('../dao/fileSystemDao')
const utils = require('../utils/util')

// 获取所有的政策制度
let getAllFiles = async (req, res, next) => {
  try {
    let { param, pageNum, pageSize } = req.query
    if (typeof param == 'string') {
      param = JSON.parse(param)
    }
    let _filter = utils.transforKey({
      category: 'file_type',
      title: 'title',
      status: 'state',
      publisherName: 'publish_user',
      publishTime: 'publish_time',
      effectiveDate: 'effective_time'
    }, param)
    let filter = utils.obj2MySql(_filter)
    let count = await fileSystemDao.getCount(filter)
    count = count.data[0].number
    let responseData = []
    let files = await fileSystemDao.getAllFiles(pageNum, pageSize, filter)
    if (files.code == 200) {
      files = utils.transformRes(files.data)
      utils.formatDate(['publishTime', 'effectiveTime'], files, 'yyyy-MM-dd')
      files.forEach((item, index) => {
        responseData.push({
          id: index + 1,
          fileSystemId: item.fileSystemId,
          category: item.fileType,
          title: item.title,
          status: item.state,
          publishTime: item.publishTime,
          publisherName: item.publishUser,
          effectiveDate: item.effectiveTime
        })
      })
      res.send({
        code: 200,
        data: responseData,
        count: count
      })
    }
    else {
      throw new Error('未能找到')
    }
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: err.message || err.msg
    })
  }
}

// 获取一个政策制度
let getFile = async (req, res, next) => {
  try {
    const fileSystemId = req.body.fileSystemId
    let fileSystem = await fileSystemDao.getFileSystem(fileSystemId)
    if (fileSystem.code == 200) {
      fileSystem = utils.transformRes(fileSystem.data)[0]
      utils.formatDate(['publishTime', 'effectiveTime'], [fileSystem], 'yyyy-MM-dd')
      let files = await fileSystemDao.getFilesByFileSystem(fileSystemId)
      files = utils.transformRes(files.data)
      files.forEach(file => {
        file.name = file.fileName
        file.status = true
      })
      res.send({
        code: 200,
        data: fileSystem,
        files: files
      })
    }
    else {
      throw new Error('未能找到该政策制度')
    }

  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: err.msg || err.message
    })
  }
}

// 删除政策制度材料
let deleteFiles = async (req, res, next) => {
  let files = req.body.files
  try {
    let rmRes = await utils.rmFile(files)
    for (let i = 0; i < rmRes.length; i++) {
      if (rmRes[i].code == 200) {
        let delRes = await fileSystemDao.deleteFile(rmRes[i].filePath)
        if (delRes.code != 200) {
          throw new Error('删除数据库失败')
        }
        console.log(delRes.code)
      }
    }
    res.send({
      code: 200,
      data: '删除材料成功'
    })
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      data: '删除材料失败'
    })
  }
}

// 修改政策制度信息
let updateFileSystem = async (req, res, next) => {
  try {
    let { fileSystem } = req.body
    fileSystem = utils.camel2_(fileSystem)
    const fileSystemId = fileSystem.file_system_id
    delete fileSystem.fileSystem_id
    fileSystemDao.updateFileSystem(fileSystem, fileSystemId)
      .then(values => {
        res.send({
          code: 200,
          msg: '修改成功'
        })
      })
      .catch(err => {
        // console.log(err)
        res.send({
          code: 500,
          msg: '修改失败'
        })
      })
  }
  catch (err) {
    // console.log(err)
  }
}

// 增加政策制度信息
let addFileSystem = async (req, res, next) => {
  try {
    const {info} = req.body
    info.file_system_id = utils.getId('fileSystem')
    let values = await fileSystemDao.addFileSystem(info)
    console.log(values)
    values.fileSystemId = info.file_system_id
    res.send(values)
  } 
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '增加文件制度失败'
    })
  }
}


let controller = {
  getAllFiles,
  getFile,
  deleteFiles,
  updateFileSystem,
  addFileSystem
}
module.exports = controller