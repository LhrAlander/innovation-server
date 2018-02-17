const path = require('path');

const crypto = require('crypto')
const fs = require('fs')
const id = {
  project: '01',
  team: '02',
  award: '03',
  policy: '04',
  dependent: '05'
}

//格式化日期
Date.prototype.Format = function (fmt) {
  var o = {
    "y+": this.getFullYear(),
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S+": this.getMilliseconds()             //毫秒
  };
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      if (k == "y+") {
        fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
      }
      else if (k == "S+") {
        var lens = RegExp.$1.length;
        lens = lens == 1 ? 3 : lens;
        fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
      }
      else {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
  }
  return fmt;
}


let getDate = () => {
  let date = new Date()
  let year = date.getFullYear().toString()
  let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + ''
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ''
  return year + month + day
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
      _key = key.replace(/\_(\w)/g, function (x) { return x.slice(1).toUpperCase(); });
      tmp[_key] = item[key]
    }
    _array.push(tmp)
  })
  return _array
}

/**
 * 将一个驼峰式转换为下划线
 * @param {*需要转换的对象数组} obj 
 */
let camel2_ = obj => {
  const transformObj = obj => {
    let tmp = {}
    for (let key in obj) {
      let value = obj[key]
      key = key.replace(/([A-Z])/g, "_$1").toLowerCase()
      tmp[key] = value
    }
    return tmp
  }
  if (obj instanceof Array) {
    let tmpArray = []
    obj.forEach(item => {
      tmpArray.push(transformObj(item))
    })
    console.log(tmpArray)
    return tmpArray
  }
  else if (obj instanceof Object) {
    return transformObj(obj)
  }
  return obj
}



/**
 * 格式化时间
 * @param {*日期对象的键名} key 
 * @param {*一个数组} array 
 * @param {*格式化字符串} format
 */
let formatDate = (key, array, format) => {
  array.forEach(obj => {
    if (key instanceof Array) {
      key.forEach(k => {
        if (obj[k] != null) {
          let date = new Date(obj[k])
          obj[k] = date.Format(format)
        }
      })

    }
    else {

      if (obj[key] != null) {
        let date = new Date(obj[key])
        obj[key] = date.Format(format)
      }
    }
  })
}

/**
 * 生成团队、依托单位、项目等ID
 * @param {*所需ID类型} type 
 */
let getId = type => {
  return id[type] + getDate() + getHash()
}

/**
 * 将对象转换成sql语句
 * @param {*筛选条件} filter 
 */
let obj2MySql = filter => {
  if (typeof filter == 'string') {
    filter = JSON.parse(filter)
  }
  let str = null
  let first = true
  for (let key in filter) {
    console.log(key, filter[key])
    if (first) {
      str = ''
    }
    else {
      str += ` and `
    }
    str += `${key} like '%${filter[key]}%'`
    first = false
  }
  return str
}

/**
 * 删除文件
 * @param {*文件数组} files 
 */
let rmFile = (files, cb) => {
  let createPromise = path => {
    return new Promise((resolve, reject) => {
      fs.unlink(path, err => {
        if (err) {
          reject({
            code: 500,
            filePath: path
          })
        }
        else {
          resolve({
            code: 200,
            filePath: path
          })
        }
      })
    })
  }
  if (files instanceof Array) {
    let promises = []
    for (let i = 0; i < files.length; i++) {
      console.log(files[i])
      promises.push(createPromise(files[i].filePath))
    }
    return Promise.all(promises)
  }
}


let utils = {
  getId,
  transformRes,
  camel2_,
  formatDate,
  obj2MySql,
  rmFile
}

module.exports = utils
