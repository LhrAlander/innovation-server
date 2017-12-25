const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController')

router.get('/user', userController.getUser)
router.post('/user', userController.createUser)

router.post('/delUser', userController.delUser)

module.exports = router;
