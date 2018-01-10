const dao = require('../dao/categoryDao')
// 获取所有用户类别
let getAllUserCategories = (req, res, next) => {
  dao.getAllUserCategories()
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 增加用户类别
let addUserCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.addUserCategory(categories)
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 删除用户类别
let deleteUserCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.deleteUserCategory(categories)
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
let controller = {
  getAllUserCategories,
  addUserCategory,
  deleteUserCategory
}

module.exports = controller