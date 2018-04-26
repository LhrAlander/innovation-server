const utils = require('../../utils/util')
const recruitmentDao = require('../../dao/front/recruitmentDao')
const countDao = require('../../dao/teamDao')

/**
 * 前端获取所有的招募信息列表
 * 1、获取所有可用的招募信息
 * 2、根据时间排序
 * 3、 返回
 */
const getRecruitments = async (req, res, next) => {
  try {
		const { pageNum, pageSize } = req.body
		let recruitments = await recruitmentDao.getAllRecruitments(pageNum, pageSize)
		let count = await recruitmentDao.getAllRecruitmentsCount()
		count = count.data[0].number
		recruitments = utils.transformRes(recruitments.data)
		utils.formatDate("publishTime", recruitments, "yyyy-MM-dd")
		console.log(recruitments)
		recruitments.forEach(p => {
      if (p.introduction) {
        p.introduction = p.introduction.replace(/<[^>]+>/g,"")
      }
      else {
        p.introduction = p.title
      }
      let date = new Date(p.publishTime)
      p.day = date.getDay();
      p.yearMonth = `${date.getFullYear()}.${date.getMonth()}`
      delete p.publishTime
    })
		res.send({
			code: 200,
			data: recruitments,
			count
		})
  }
  catch (err) {
    console.log(err)
    res.status(500).send('查询失败')
  }
}

/**
 * 前端获取某一招募信息的详情
 */
const getRecruitment = async (req, res, next) => {
  try {
   
  } 
  catch (err) {
    console.log(err)
  }
}


let controller = {
  getRecruitments,
  getRecruitment,
}

module.exports = controller