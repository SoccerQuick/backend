const Joi = require('joi');

//[ 유저정보 조회 ]
const getUserInfoSchema = Joi.object({
  id: Joi.string().label('아이디').required(),
});

// [ 유저정보 수정 ]
const updateUserInfoSchema = Joi.object({
  user_id: Joi.string().label('아이디').alphanum().min(3).max(20).required(),
  password: Joi.string()
    .label('비밀번호')
    .pattern(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,16}$/)
    .required(),
  nick_name: Joi.string()
    .label('닉네임')
    .pattern(/^[가-힣|a-z|A-Z|0-9]+$/)
    .min(2)
    .max(10)
    .required(),
  email: Joi.string()
    .label('이메일')
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required(),
  phone_number: Joi.string()
    .label('연락처')
    .pattern(/^010\d{8}$/)
    .required(),
});

//[ 유저 회원탈퇴 ]
const deleteUserInfoSchema = Joi.object({
  user_id: Joi.string().label('아이디').required(),
  password: Joi.string().label('비밀번호').required(),
});

module.exports = {
  getUserInfoSchema,
  updateUserInfoSchema,
  deleteUserInfoSchema,
};
