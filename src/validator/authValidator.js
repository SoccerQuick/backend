const Joi = require('joi');

const signUpSchema = Joi.object({
  user_id: Joi.string().label('아이디').alphanum().min(3).max(20).required(),
  password: Joi.string()
    .label('비밀번호')
    .pattern(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,16}$/)
    .required(),
  name: Joi.string()
    .label('이름')
    .pattern(/^[가-힣]+$/)
    .min(2)
    .max(10)
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
  gender: Joi.string().label('성별').valid('남', '여').required(),
});

const logInSchema = Joi.object({
  user_id: Joi.string().label('아이디').required(),
  password: Joi.string().label('비밀번호').required(),
});

const validateUniqueUserIdSchema = Joi.object({
  user_id: Joi.string().label('아이디').alphanum().min(3).max(20).required(),
});

const validatePasswordSchema = Joi.object({
  user_id: Joi.string().label('아이디').required(),
  password: Joi.string().label('비밀번호').required(),
});

module.exports = {
  signUpSchema,
  logInSchema,
  validateUniqueUserIdSchema,
  validatePasswordSchema,
};
