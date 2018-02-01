const crypto = require('crypto')
const id = {
  project: '01',
  team: '02'
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

/**
 * 将一个下划线连接的对象数组中的对象转换为驼峰对象
 * @param {*需要转换的对象数组} obj 
 */
let transformRes = obj => {
  let _array = []
  obj.forEach(item => {
    let tmp = {}
    for (let key in item) {
      _key = key.replace(/\_(\w)/g, function(x){return x.slice(1).toUpperCase();});
      tmp[_key] = item[key]
    }
    _array.push(tmp)
  })
  return _array
}

/**
 * 生成团队、依托单位、项目等ID
 * @param {*所需ID类型} type 
 */
let getId = type => {
  return id[type] + getDate() + getHash()
}

let utils = {
  getId,
  transformRes
}

module.exports = utils
