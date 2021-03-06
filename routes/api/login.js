const express = require('express')
const router = express.Router()
const db = require('../../utils/DBQuery')


const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");


router.post('/', async (req, res, next) => {
  // console.log(req.headers.Authorization)
  let user = req.body.user
  if (!user.id || !user.password) {
    return res.status(400).send("请输入用户名和密码");
  }
  try {
    let values = await db.queryPromise(`select * from user where user_id='${user.id}' and user_pwd='${user.password}'`)
    if (values.code == 200 && values.data.length > 0) {
      console.log(values)
      if (values.data[0].account_state != '可用') {
        res.status(401).send('您的账号当前不可用')
        return
      }
      // 加密，获取token
      var authToken = jwt.sign({
        username: values.data[0].user_name,
        userId: values.data[0].user_id,
        type: values.data[0].user_identity
      }, "secret", {
          expiresIn: 60 * 60 * 24 * 7// 授权时效7天
        });
      // 发送给前端，存在浏览器里
      res.status(200).send({
        token: authToken,
        user: {
          username: values.data[0].user_name,
          userId: values.data[0].user_id,
          type: values.data[0].user_identity
        }
      });
    }
    else {
      res.status(401).send('请输入正确的用户名和密码')
    }
  }
  catch (err) {
    console.log(err)
  }
})

module.exports = router 