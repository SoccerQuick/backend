const mongoose = require('mongoose');

// [ 유저 모델 ]
const { UserSchema, WithdrawnUserSchema } = require('../schemas/userSchema');
const User = mongoose.model('User', UserSchema);
const WithdrawnUser = mongoose.model('WidthdrawnUser', WithdrawnUserSchema);

// [ 관리자 기능 모델 ]
const AdminSchema = require('../schemas/adminSchema');
const Admin = mongoose.model('Admin', AdminSchema);

// [ 커뮤니티 관련 모델 ]
const { PostSchema, CommentSchema } = require('../schemas/communitySchema');
const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);

// [ 리뷰 관련 모델 ]
const ReviewSchema = require('../schemas/reviewSchema');
const Review = mongoose.model('Review', ReviewSchema);

// [ 팀 그룹 관련 모델 ]
const GroupSchema = require('../schemas/groupSchema');
const Group = mongoose.model('Group', GroupSchema);

// [ 경기장 관련 모델 ]
const domSchema = require('../schemas/domSchema');
const Dom = mongoose.model('Dom', domSchema);

module.exports = {
  User,
  Admin,
  WithdrawnUser,
  Post,
  Comment,
  Review,
  Group,
  Dom,
};
