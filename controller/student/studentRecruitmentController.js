const recruitmentDao = require('../../dao/recruitmentDao')
const utils = require('../../utils/util')

const getSignupById = async (req, res, next) => {
	try {
		const { id } = req.body
		let v = await recruitmentDao.getSignupById(id)
		v = utils.transformRes(v.data)
		utils.formatDate(["endTime", "signUpTime"], v, "yyyy-MM-dd")
		let files = await recruitmentDao.getSignupFiles(id)
		files = utils.transformRes(files.data)
		files.forEach(file => {
			file.name = file.fileName
			file.status = true
		})
		res.send({
			code: 200,
			data: v[0],
			files
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

/**
 * 1、获取招募信息
 * 2、比对截止时间和修改时间
 */
const changeSingnupById = async (req, res, next) => {
	try {
		let { signup } = req.body
		const signupId = signup.id
		let recruitment = await recruitmentDao.getRecruitmentBySignup(signupId)
		let endTime = new Date(recruitment.data[0].end_time)
		let signupTime = new Date(signup.sign_up_time)
		if (signupTime > endTime) {
			res.send({
				code: 401,
				msg: '已过截止日期'
			})
		}
		else {
			const id = signup.id
			delete signup.id
			let v = await recruitmentDao.changeRecruitmentSignup(id, signup)
			console.log(v)
			res.send({
				code: 200,
				msg: '更新成功'
			})
		}
	}
	catch (err) {
		console.log(err)
		res.send({
			code: 500,
			msg: '查询失败'
		})
	}
}

const deleteFiles = async (req, res, next) => {
	let files = req.body.files
	try {
		let rmRes = await utils.rmFile(files)
		for (let i = 0; i < rmRes.length; i++) {
			if (rmRes[i].code == 200) {
				let delRes = await recruitmentDao.deleteSignupFile(rmRes[i].filePath)
				if (delRes.code != 200) {
					throw new Error('删除数据库失败')
				}
				console.log(delRes.code)
			}
		}
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

const getOptions = async (req, res, next) => {
	try {
		const { today } = req.body
		let recruitments = await recruitmentDao.getOptions(today)
		recruitments = utils.transformRes(recruitments.data)
		utils.formatDate("endTime", recruitments, "yyyy-MM-dd")
		console.log(recruitments)
		let data = recruitments.map(r => {
			return {
				value: r.id,
				endTime: r.endTime,
				label: r.title
			}
		})
		res.send({
			code: 200,
			data
		})
	} catch (err) {
		console.log(err)
	}
}

const addSignup = async (req, res, next) => {
	try {
		let signup = req.body.signup
		signup.id = utils.getId('signup')
		console.log(signup)
		let values = await recruitmentDao.addSignup(signup)
		values.id = signup.id
		res.send(values)
	} 
	catch (err) {
		console.log(err)
	}
}

let controller = {
	getSignupById,
	changeSingnupById,
	deleteFiles,
	getOptions,
	addSignup
}
module.exports = controller