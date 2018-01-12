const crypto = require('crypto')
const id = {
  project: '01'
}

let getDate = () => {
  let date = new Date()
  let year = date.getFullYear().toString()
  let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + ''
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ''
  return year+month+day
}

let getHash = () => {
  let current_date = (new Date()).valueOf().toString();
  let random = Math.random().toString();
  let str = crypto.createHash('sha1').update(current_date + random).digest('hex');
  return str.substr(2, 7)
}

let getProjectId = () => {
  return id.project + getDate() + getHash()
}

let utils = {
  getProjectId
}

module.exports = utils
