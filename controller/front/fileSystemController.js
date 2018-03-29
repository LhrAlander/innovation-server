const utils = require('../../utils/util')
const fileSystemDao = require('../../dao/front/fileSystemDao')
const countDao = require('../../dao/fileSystemDao')

const getFileSystems = async (req, res, next) => {
  try {
    const { pageNum, pageSize } = req.query
    let filter = `state='可用'`
    let count = await countDao.getCount(filter)
    count = count.data[0].number
    let files = await fileSystemDao.getAllFileSystems(pageNum, pageSize)
    files.data.forEach(p => {
      if (p.introduction) {
        p.introduction = p.introduction.replace(/<[^>]+>/g,"")
      }
      else {
        p.introduction = p.title
      }
      let date = new Date(p.publishTime)
      p.day = date.getDay();
      p.yearMonth = `${date.getFullYear()}.${date.getMonth()}`
      delete p.publishTime
    })
    res.send({
      count,
      files: files.data
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

const getFileSystem = async (req, res, next) => {
  try {
    const fileSystemId = req.body.fileSystemId
    let file = await fileSystemDao.getFileSystemById(fileSystemId)
    utils.formatDate('publishTime', file.data, 'yyyy-MM-dd')
    console.log(file)
    res.send(file.data[0])
  } 
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}


let controller = {
  getFileSystems,
  getFileSystem
}

module.exports = controller