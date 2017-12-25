// 基本用户模型



let createUser = (userId, userName, userSex, userMail, userPhone, accountState, userIdentity) => {
    return {
        user_id: userId,
        user_name: userName,
        user_sex: userSex,
        user_mail: userMail,
        user_phone: userPhone,
        account_state: accountState,  // 账号状态，默认为待审核
        user_identity: userIdentity   // 用户类型 学生、教师、依托单位负责人
    }
}

let userUtil = {
    createUser
}
module.exports = userUtil