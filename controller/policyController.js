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
          intro: item.policy_introduction,
          policyId: item.policy_id
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
  try {
    const { policy } = req.body
    utils.camel2_(policy)
    console.log(policy)
    const policyId = policy.policy_id
    delete policy.policy_id
    policyDao.updatePolicy(policy, policyId)
      .then(values => {
        res.send({
          code: 200,
          msg: '发布政策成功'
        })
      })
      .catch(err => {
        console.log(err)
        res.send({
          code: 500,
          msg: '发布政策失败'
        })
      })
  }
  catch (err) {
    console.log(err)
  }

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
  let responseData = {
    code: 200
  }
  policyDao.getPolicy(policyId)
    .then(values => {
      utils.formatDate('publish_time', values.data, 'yyyy-MM-dd')
      values.data = utils.transformRes(values.data)[0]
      responseData.policy = values.data
      const projectId = values.data.policyId
      return policyDao.getFile(policyId)
    })
    .then(values => {
      if (values.code == 200) {
        responseData.file = utils.transformRes(values.data)
      }
      console.log(responseData.file)
      res.send(responseData)
    })
    .catch(err => {
      console.log(err)
      res.send({
        code: 500,
        msg: '获取一个政策信息失败'
      })
    })

}

// 删除项目材料附件
let deleteFiles = async (req, res, next) => {
  let files = req.body.files
  try {
    let rmRes = await utils.rmFile(files)
    console.log(rmRes)
    for (let i = 0; i < rmRes.length; i++) {
      if (rmRes[i].code == 200) {
        let delRes = await policyDao.deleteFile(rmRes[i].filePath)
        if (delRes.code != 200) {
          throw new Error('删除数据库失败')
        }
        console.log(delRes.code)
      }
    }
    console.log('success')
    res.send({
      code: 200,
      data: '删除材料成功'
    })
  }
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      data: '删除材料失败'
    })
  }
}


let controller = {
  getAllPolicys,
  updatePolicy,
  addPolicy,
  getPolicy,
  deleteFiles
}

module.exports = controller