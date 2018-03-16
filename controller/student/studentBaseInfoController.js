const studentDao = require('../../dao/studentDao')
let getMyInfo = async (req, res, next) => {
  try {
    console.log(req.user)
    const userId = req.user.userId
    student = await studentDao.getStudent(userId)
    if (student.code == 200 && student.data.length > 0) {
      res.send(student)
    }
    else {
      res.status(500).send('查询失败')
    }
    console.log(student)
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