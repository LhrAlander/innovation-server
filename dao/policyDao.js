const queryHelper = require('../utils/DBQuery')
const config = require('../config')

let getAllPolicys = () => {
  const sql = 'select * from policy'
  return queryHelper.queryPromise(sql)
}

let policyDao = {
  getAllPolicys
}

module.exports = policyDao