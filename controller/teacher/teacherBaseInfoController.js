const teacherDao = require('../../dao/teacherDao')
const studentDao = require('../../dao/studentDao')
const companyDao = require('../../dao/companyDao')
let getMyInfo = async (req, res, next) => {
  try {
    const userId = req.user.userId
    let type = req.user.type
    student = await teacherDao.getTeacher(userId, type)
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
    let { user, company } = req.body
    const userId = user.user_id
    delete user.user_id
    let value = await studentDao.changeInfo(userId, user)
    if ('user_id' in company) {
      value = await companyDao.changeCompany(company)
    }
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