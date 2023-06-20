const Joi = require('joi');

// 팀 등록
const addGroupSchema = Joi.object({
  title: Joi.string().label('팀 모집 글 제목').required(),
  leader_id: Joi.string().label('리더 아이디').required(),
  location: Joi.string().label('지역').required(),
  gk_count: Joi.number().label('구하는 골키퍼 수').required(),
  player_count: Joi.number().label('구하는 플레이어 수').required(),
  gk_current_count: Joi.number().label('현재 골키퍼 수').required(),
  player_current_count: Joi.number().label('현재 플레이어 수').required(),
  contents: Joi.string().label('팀 모집 본문').required(),
});

//자기 팀 정보 수정
const updateMyGroupSchema = Joi.object({
  groupId: Joi.string().label('그룹 아이디').required(),
  user_id: Joi.string().label('리더 아이디').required(),
  location: Joi.string().label('경기 위치'),
  status: Joi.string().label('모집 상태'),
  gk_count: Joi.string().label('모집하는 골키퍼 수'),
  player_count: Joi.string().label('모집하는 플레이어 수'),
  gk_current_count: Joi.string().label('현재 팀 골키퍼 수'),
  player_current_count: Joi.string().label('현재 팀 플레이어 수'),
  title: Joi.string().label('모집글 제목'),
  contents: Joi.string().label('모집글 본문'),
});

//유저 - 팀 신청
const userApplicantGroupSchema = Joi.object({
  groupId: Joi.string().label('팀 id').required(),
  user_id: Joi.string().label('아이디').required(),
  position: Joi.string().label('포지션').required(),
  level: Joi.string().label('자신의 레벨(수준)').required(),
  contents: Joi.string().label('본문'),
});

//팀 리더  - 신청한 유저 수락.
const leaderApplicantSchema = Joi.object({
  groupId: Joi.string().label('팀 id').required(),
  leaderId: Joi.string().label('팀 리더 아이디').required(),
  user_id: Joi.string().label('아이디').required(),
});

module.exports = {
  addGroupSchema,
  updateMyGroupSchema,
  userApplicantGroupSchema,
  leaderApplicantSchema,
};
