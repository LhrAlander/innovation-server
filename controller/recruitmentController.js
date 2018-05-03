const recruitmentDao = require('../dao/recruitmentDao')
const utils = require('../utils/util')

const getRecruitments = async (req, res, next) => {
	try {
		let { filter, pageNum, pageSize } = req.body
		filter = utils.camel2_(filter)
		console.log(filter)
		
		filter = utils.obj2MySql(filter)
		let count = await recruitmentDao.getCount(filter)
		let recruitments = await recruitmentDao.getRecruitments(filter, pageNum, pageSize)
		recruitments = utils.transformRes(recruitments.data)
		utils.formatDate(['publishTime', 'endTime'], recruitments, 'yyyy-MM-dd')
		count = count.data[0].number
		res.send({
			data: recruitments,
			count
		})
	} 
	catch (err) {
		console.log(err)
	}
}

const getSingUps = async (req, res, next) => {
	try {
		let { filter, pageNum, pageSize } = req.body
		filter = utils.camel2_(filter)
		if ("state" in filter) {
			filter["recruitment_sign_up.state"] = filter.state
			delete filter.state
		}
		filter = utils.obj2MySql(filter)
		let count = await recruitmentDao.getSignupCount(filter)
		count = count.data[0].number
		let signups = await recruitmentDao.getSingUps(filter, pageNum, pageSize)
		signups = utils.transformRes(signups.data)
		utils.formatDate('signUpTime', signups, 'yyyy-MM-dd')
		res.send({
			data: signups,
			count
		})
	} 
	catch (err) {
		console.log(err)
	}
}

/**
 * 获取特定招募信息详情
 * 1、获取招募基本信息
 * 2、获取附件信息
 */
const getRecruitmentById = async (req, res, next) => {
	try {
		const recruitmentId = req.body.recruitmentId
		let recruitment = await recruitmentDao.getRecruitmentById(recruitmentId)
		recruitment = utils.transformRes(recruitment.data)
		utils.formatDate(["publishTime", "endTime"], recruitment, "yyyy-MM-dd")
		let files = await recruitmentDao.getRecruitmentFilesById(recruitmentId)
		files = utils.transformRes(files.data)
		files.forEach(file => {
			file.name = file.fileName
			file.status = true
		})
		res.send({
			code: 200,
			data: recruitment[0],
			files: files
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

const changeRecruitment = async (req, res, next) => {
	try {
		let info = req.body.recruitment
		let id = info.id
		delete info.id
		let values = await recruitmentDao.changeRecruitment(id, info)
		res.send({
			code: 200,
			msg: '操作成功'
		})
	}
	catch (err) {
		console.log(err)
		res.send({
			code: 500,
			msg: '操作失败，稍后重试'
		})
	}

}

const changeSignup = async (req, res, next) => {
	try {
		let info = req.body.info
		let id = info.id
		delete info.id
		let values = await recruitmentDao.changeSignup(id, info)
		res.send({
			code: 200,
			msg: '操作成功'
		})	
	} 
	catch (err) {
		console.log(err)
		res.send({
			code: 500,
			msg: '操作失败，稍后重试'
		})
	}
}

const deleteFiles = async (req, res, next) => {
	let files = req.body.files
  try {
    let rmRes = await utils.rmFile(files)
    for (let i = 0; i < rmRes.length; i++) {
      if (rmRes[i].code == 200) {
        let delRes = await recruitmentDao.deleteFile(rmRes[i].filePath)
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

const addRecruitment = async (req, res, next) => {
	try {
		let { recruitment } = req.body
		recruitment.id = utils.getId('recruitment')
		let values = await recruitmentDao.addRecruitment(recruitment)
		values.id = recruitment.id
		res.send(values)
	} 
	catch (err) {
		console.log(err)
		res.send({
      code: 500,
      msg: '增加招募信息失败'
    })
	}
}

let deleteRecruitment = async (req, res, next) => {
  try {
    const recruitment = req.body.recruitment
    let v = await recruitmentDao.deleterecruitment(recruitment.id)
    let files = await recruitmentDao.getFilesById(recruitment.id)
    files = files.data
    let rmRes = await utils.rmFile(files)
    for (let i = 0; i < rmRes.length; i++) {
      if (rmRes[i].code == 200) {
        let delRes = await recruitmentDao.deleteFile(rmRes[i].filePath)
        if (delRes.code != 200) {
          throw new Error('删除成功')
        }
        console.log(delRes.code)
      }
    }
    console.log('success')
    res.send({
      code: 200,
      data: '删除招募信息成功'
    })
  } 
  catch (err) {
    console.log(err)
    res.send({
      code: 500,
      data: '删除招募信息失败'
    })
  }
}

let controller = {
	getRecruitments,
	getSingUps,
	getRecruitmentById,
	changeRecruitment,
	changeSignup,
	deleteFiles,
	addRecruitment,
	deleteRecruitment
}
module.exports = controller