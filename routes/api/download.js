const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log(req.query)
  const { filePath, fileName } = req.query
  res.download(filePath, fileName, err => {
    if (err) {
      console.log('下载出错', err)
    }
  })
})

module.exports = router