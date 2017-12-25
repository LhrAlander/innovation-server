const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController')

router.get('/user', userController.getUser)
// 增加一个用户
router.post('/user', userController.createUser)

router.post('/delUser', userController.delUser)

module.exports = router;
