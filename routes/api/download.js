const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

router.get('/', (req, res, next) => {
  let path = './public/uploads/project/Jan14.docx-1516364670773.docx'
  res.download(path, 'a.txt', err => {
    if (err) {
      console.log('下载出错', err)
    }
  })
})

module.exports = router