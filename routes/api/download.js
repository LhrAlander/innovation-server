const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log(req.query)
  let { filePath, fileName } = req.query
  console.log(filePath, fileName)
  filePath = unescape(filePath)
  fileName = unescape(fileName)
  res.download(filePath, fileName, err => {
    if (err) {
      console.log('下载出错', err)
    }
  })
})

module.exports = router