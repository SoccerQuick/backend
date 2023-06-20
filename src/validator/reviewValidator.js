const Joi = require('joi');

const addReviewSchema = Joi.object({
  user_id: Joi.string().label('아이디').required(),
  dom_id: Joi.string().label('풋볼장번호').required(),
  contents: Joi.string().label('리뷰내용').required(),
});

const updateReviewSchema = Joi.object({
  reviewId: Joi.string().label('리뷰번호').required(),
  user_id: Joi.string().label('아이디').required(),
  domId: Joi.string().label('구장아이디').required(),
  contents: Joi.string().label('리뷰내용').required(),
});

const deleteReviewSchema = Joi.object({
  reviewId: Joi.string().label('리뷰번호').required(),
  user_id: Joi.string().label('아이디').required(),
  domId: Joi.string().label('구장 아이디').required(),
});

module.exports = { addReviewSchema, updateReviewSchema, deleteReviewSchema };
