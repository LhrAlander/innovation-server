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

// 修改政策
let updatePolicy = (req, res, next) => {
  const { policy } = req.body
  utils.camel2_(policy)
  const policyId = policy.policy_id
  delete policy.policy_id
  policyDao.updatePolicy(policy, policy_id)
    .then(values => {
      res.send({
        code: 200,
        msg: '发布政策成功'
      })
    })
    .catch(err => {
      res.send({
        code: 500,
        msg: '发布政策失败'
      })
    })
}

// 增加一个政策
let addPolicy = (req, res, next) => {
  const { policy } = req.body
  utils.camel2_(policy)
  policy.policy_id = utils.getId('policy')
  policyDao.addPolicy(policy)
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send({
        code: 500,
        msg: '增加政策信息失败'
      })
    })
}

// 获取一个政策
let getPolicy = (req, res, next) => {
  const { policyId } = req.body
  policyDao.getPolicy(policyId)
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send({
        code: 500,
        msg: '获取一个政策信息失败'
      })
    })

}

let controller = {
  getAllPolicys,
  updatePolicy,
  addPolicy,
  getPolicy
}

module.exports = controller