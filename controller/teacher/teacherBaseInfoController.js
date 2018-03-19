const teacherDao = require('../../dao/teacherDao')
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


let controller = {
  getMyInfo
}

module.exports = controller