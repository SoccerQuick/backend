const { Schema } = require('mongoose');

// Review 스키마
const ReviewSchema = new Schema(
  {
    review_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dom_id: {
      type: Schema.Types.ObjectId,
      ref: 'Dom',
      required: true,
    },
    ground_id: {
      type: String,
      ref: 'Dom.dom_id',
      required: true,
    },
    name: {
      type: String,
      ref: 'User',
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
    userslikes: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        user_id: {
          type: String,
          ref: 'User.user_id',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = ReviewSchema;
