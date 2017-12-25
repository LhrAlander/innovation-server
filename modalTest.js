const userUtil = require('./modal/user')

console.log(userUtil)

let _user = userUtil.createUser('2015210405043', '林海瑞', '男', 'AlanderLt@163.com', '13588737694', '待审核', '学生')
console.log(_user)