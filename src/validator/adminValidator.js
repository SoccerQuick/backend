const Joi = require('joi');

const getAllUserInfoSchema = Joi.object({
  user_id: Joi.string().label('아이디').required(),
});

const adminBanSchema = Joi.object({
  user_id: Joi.string().label('아이디').required(),
  banUserId: Joi.string().label('정지 할 아이디').required(),
});

const updateUserRoleSchema = Joi.object({
  user_id: Joi.string().label('아이디').required(),
  updateUser: Joi.string().label('관리자 권한을 부여 할 아이디').required(),
});

module.exports = {
  getAllUserInfoSchema,
  adminBanSchema,
  updateUserRoleSchema,
};
