const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");


const adminRouter = ['/api/user', '/api/baseInfo', '/api/student', '/api/teacher', '/api/company', '/api/category', '/api/project', '/api/team', '/api/award', '/api/policy', '/api/dependent', '/api/notification', '/api/fileSystem', '/api/recruitment']
const studentRouter = ['/api/st']
const teacherRouter = ['/api/th']
const companyRouter = []

// 对所有路由进行鉴权处理
const auth = (req, res, next) => {
  try {
    const token = req.user
    const url = req.path
    let needAuth = null
    let judgeRt = []
    // 判断发送请求的用户类型
    switch (token.type) {
      case '管理员':
        judgeRt = adminRouter
        break
      case '学生':
        judgeRt = studentRouter
        break
      case '教师':
        judgeRt = teacherRouter
        break
      case '企业':
        judgeRt = companyRouter
        break
    }
    if (judgeRt.some(rt => {
      return url.startsWith(rt)
    })) {
      next()
    }
    else if (req.headers.authtoken) {
      jwt.verify(req.headers.authtoken, 'secret', (err, decoded) => {
        if (err) {
          res.status(401).send('身份过期')
        }
        else {
          next()
        }
      })
    }
    else {
      res.status(401).send('鉴权失败')
    }
    // if (adminRouter.some(rt => {
    //   return url.startsWith(rt)
    // })) {
    //   needAuth = '管理员'
    // }
    // else if (studentRouter.some(rt => {
    //   return url.startsWith(rt)
    // })) {
    //   needAuth = '学生'
    // }
    // else if (teacherRouter.some(rt => {
    //   return url.startsWith(rt)
    // })) {
    //   needAuth = '教师'
    // }
    // else if (companyRouter.some(rt => {
    //   return url.startsWith(rt)
    // })) {
    //   needAuth = '企业'
    // }
    // if (!needAuth || needAuth == token.type) {
    //   next()
    // }
    // else {
    //   if (req.headers.authtoken) {
    //     console.log('存在 token', req.headers.authtoken)
    //     jwt.verify(req.headers.authtoken, 'secret', (err, decoded) => {
    //       if (err) {
    //         res.status(401)
    //       }
    //       else {
    //         next()
    //       }
    //     })
    //   }
    //   else {
    //     res.status(401).send('鉴权失败')
    //   }
    // }
  }
  catch (err) {
    console.log(err)
    res.status(401).send('鉴权失败')
  }
}

const adminAuth = (req, res, next) => {
  try {
    var token = req.user;
    if (token.type != '管理员') {
      res.status(401).send('非管理员身份')
    }
    else {
      next()
    }
  }
  catch (err) {
    console.log(err)
    res.status(401).send('鉴权失败')
  }
}


module.exports = {
  auth,
  adminAuth
}