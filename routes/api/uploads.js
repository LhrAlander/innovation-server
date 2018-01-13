const express = require('express')
const router = express.Router()

router.post('/file', (req, res, next) => {
  console.log(req.files)
  console.log('hi')
  res.send('hello')
})

module.exports = router