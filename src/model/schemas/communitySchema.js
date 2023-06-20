const { Schema } = require('mongoose');

// [ 커뮤니티 게시글 스키마 ]
const PostSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    notice: {
      type: String,
      enum: ['공지사항', '일반 게시글'],
      default: '일반 게시글',
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

// [ 커뮤니티 댓글 스키마 ]
const CommentSchema = new Schema(
  {
    comment_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post_id: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = {
  PostSchema,
  CommentSchema,
};
