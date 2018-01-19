const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log( __dirname)
  fs.readFile('./public/uploads/project/Jan14.docx-1516364670773.docx', (err, data) => {
    if (err) {
      console.log('err', err)
      res.send(err)
    }
    else {
      console.log('success', data.toString())
      
      res.send(data.toString('utf-8'))
    }
  })
})

module.exports = router