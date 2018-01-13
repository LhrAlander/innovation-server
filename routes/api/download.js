const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.download('public/uploads/Chap8.ppt-1515833512870.ppt')
})

module.exports = router