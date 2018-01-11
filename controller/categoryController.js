const dao = require('../dao/categoryDao')
// 获取所有用户类别
let getAllUserCategories = (req, res, next) => {
  dao.getAllCategories('user_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 增加用户类别
let addUserCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.addCategory(categories, 'user_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 删除用户类别
let deleteUserCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.deleteCategory(categories, 'user_identity', 'user_identity_name')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}



// 获取所有项目级别
let getAllProjectLevels = (req, res, next) => {
  dao.getAllCategories('project_level')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 删除项目级别
let deleteProjectLevel = (req, res, next) => {
  const levels = req.body.levels
  dao.deleteCategory(levels, 'project_level', 'level_name')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 添加项目级别
let addProjectLevel = (req, res, next) => {
  const levels = req.body.levels
  dao.addCategory(levels, 'project_level')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}


// 获取所有项目类别
let getAllProjectCategories = (req, res, next) => {
  dao.getAllCategories('project_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 删除项目类别
let deleteProjectCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.deleteCategory(categories, 'project_identity', 'identity_name')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 添加项目类别
let addProjectCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.addCategory(categories, 'project_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}


// 获取所有团队类别
let getAllTeamCategories = (req, res, next) => {
  dao.getAllCategories('team_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 删除团队类别
let deleteTeamCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.deleteCategory(categories, 'team_identity', 'identity_name')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 添加团队类别
let addTeamCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.addCategory(categories, 'team_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}


// 获取所有获奖级别
let getAllAwardLevels = (req, res, next) => {
  dao.getAllCategories('award_level')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 删除获奖级别
let deleteAwardLevel = (req, res, next) => {
  const levels = req.body.levels
  dao.deleteCategory(levels, 'award_level', 'level_name')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 添加获奖级别
let addAwardLevel = (req, res, next) => {
  const levels = req.body.levels
  dao.addCategory(levels, 'award_level')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}


// 获取所有获奖类别
let getAllAwardCategories = (req, res, next) => {
  dao.getAllCategories('award_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 删除获奖类别
let deleteAwardCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.deleteCategory(categories, 'award_identity', 'identity_name')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 添加获奖类别
let addAwardCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.addCategory(categories, 'award_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}

// 获取所有政策类别
let getAllPolicyCategories = (req, res, next) => {
  dao.getAllCategories('policy_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 删除政策类别
let deletePolicyCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.deleteCategory(categories, 'policy_identity', 'identity_name')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 添加政策类别
let addPolicyCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.addCategory(categories, 'policy_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}

// 获取所有依托单位类别
let getAllDependentCategories = (req, res, next) => {
  dao.getAllCategories('dependent_unit_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 删除依托单位类别
let deleteDependentCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.deleteCategory(categories, 'dependent_unit_identity', 'identity_name')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 添加依托单位类别
let addDependentCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.addCategory(categories, 'dependent_unit_identity')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}

// 获取所有状态类别
let getAllStateCategories = (req, res, next) => {
  dao.getAllCategories('state_table')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 删除状态类别
let deleteStateCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.deleteCategory(categories, 'state_table', 'state_name')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}
// 添加状态类别
let addStateCategory = (req, res, next) => {
  const categories = req.body.categories
  dao.addCategory(categories, 'state_table')
    .then(values => {
      res.send(values)
    })
    .catch(err => {
      res.send(err)
    })
}


let controller = {
  getAllUserCategories,
  addUserCategory,
  deleteUserCategory,
  getAllProjectLevels,
  addProjectLevel,
  deleteProjectLevel,
  getAllProjectCategories,
  deleteProjectCategory,
  addProjectCategory,
  getAllTeamCategories,
  deleteTeamCategory,
  addTeamCategory,
  getAllAwardLevels,
  addAwardLevel,
  deleteAwardLevel,
  getAllAwardCategories,
  deleteAwardCategory,
  addAwardCategory,
  getAllPolicyCategories,
  deletePolicyCategory,
  addPolicyCategory,
  getAllDependentCategories,
  deleteDependentCategory,
  addDependentCategory,
  getAllStateCategories,
  deleteStateCategory,
  addStateCategory,
}

module.exports = controller