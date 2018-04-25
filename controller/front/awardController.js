const utils = require('../../utils/util')
const awardDao = require('../../dao/front/awardDao')

let getAwards = async (req, res, next) => {
	try {
		let awards = await awardDao.getAward()
		awards = utils.transformRes(awards.data)
		utils.formatDate('awardTime', awards, 'yyyy-MM-dd')
		awards.forEach(a => {
			a.name = `${a.awardTime} ${a.awardName}${a.awardIdentity}${a.awardLevel}`
		})
		res.send(awards)
	} 
	catch (err) {
		res.send({
			code: 500,
			msg: '查询失败'
		})
	}
}
// 获取获奖情况
/**
 * 1、获取所有的获奖项目
 * 2、根据项目寻找获奖成员
 * 3、获取所有个人获奖项目
 * 4、合并数组
 * 5、根据获奖时间排序
 * 6、根据页数截取返回数据
 */
let getAwardUsers = async (req, res, next) => {
	try {
		let awardPjs = await awardDao.getAwardProjects()
		let awardUsers = await awardDao.getAwardUsers()
		const { currentPage, pageSize } = req.body
		awardPjs = utils.transformRes(awardPjs.data)
		awardUsers = utils.transformRes(awardUsers.data)
		utils.formatDate('awardTime', awardPjs, 'yyyy-MM-dd')
		utils.formatDate('awardTime', awardUsers, 'yyyy-MM-dd')
		for (let i = 0; i < awardPjs.length; i++) {
			let ap = awardPjs[i]
			const projectId = ap.awardProject
			let users = await awardDao.getProjectUsers(projectId)
			users = users.data
			let _users = []
			users.forEach(u => {
				_users.push(u.user_name)
			})
			users = _users.join("")
			ap.users = users
		}
		awardUsers.forEach(u => {
			u.users = u.userName
			delete u.userName
		})
		let allAwardUsers = awardPjs.concat(awardUsers)
		allAwardUsers.sort((a, b) => {
			let dateA = new Date(a.awardTime)
			let dateB = new Date(b.awardTime)
			if (dateA > dateB) 
				return -1
			if (dateA < dateB)
				return 1
			return 0
		})
		let total = allAwardUsers.length
		let values = allAwardUsers.slice((currentPage - 1) * pageSize, pageSize)
		let startId = (currentPage - 1) * pageSize + 1
		values.forEach(v => {
			v.id = startId++
		})
		res.send({
			code: 200,
			data: values,
			total
		})
	} 
	catch (err) {
		console.log(err)
		res.send({
			code: 500,
			msg: '查询失败'
		})
	}
}

let controller = {
	getAwards,
	getAwardUsers
}

module.exports = controller