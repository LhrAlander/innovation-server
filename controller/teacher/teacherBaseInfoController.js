const teacherDao = require('../../dao/teacherDao')
const studentDao = require('../../dao/studentDao')
let getMyInfo = async (req, res, next) => {
  try {
    const userId = req.user.userId
    student = await teacherDao.getTeacher(userId)
    if (student.code == 200 && student.data.length > 0) {
      res.send(student)
    }
    else {
      res.status(500).send('查询失败')
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

let changeInfo = async (req, res, next) => {
  try {
    let { user } = req.body
    const userId = user.user_id
    delete user.user_id
    let value = studentDao.changeInfo(userId, user)
    res.send({
      code: 200,
      msg: '更改个人信息成功'
    })
  } 
  catch (err) {
    console.log(err)  
  }
}



let controller = {
  getMyInfo,
  changeInfo
}

module.exports = controller