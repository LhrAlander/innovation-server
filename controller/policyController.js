const policyDao = require('../dao/policyDao')
const utils = require('../utils/util')

// 查找所有政策信息
let getAllPolicys = (req, res, next) => {
  policyDao.getAllPolicys()
    .then(values => {
      let responseData = []
      values.data.forEach((item, index) => {
        let data = {
          // 表格数据
          id: index + 1,
          govCategory: item.policy_identity,
          title: item.policy_title,
          status: item.state == '已发布' ? 'published' : 'unpublished',
          intro: item.policy_introduction
        }
        responseData.push(data)
      })
      
      res.send({
        code: 200,
        data: responseData
      })
    })
    .catch(err => {
      console.log(err)
      res.send({
        code: 500,
        msg: '查找所有政策失败'
      })
    })
}

let controller = {
  getAllPolicys
}

module.exports = controller