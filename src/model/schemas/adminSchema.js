const { Schema } = require('mongoose');

const AdminSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: Boolean,
    default: false,
    required: true,
  },
  create_notice: {
    type: Boolean,
    default: false,
  },
  suspend_user_login: {
    type: Boolean,
    default: false,
  },
  suspend_posting: {
    type: Boolean,
    default: false,
  },
  suspend_recruitment: {
    type: Boolean,
    default: false,
  },
  force_withdrawal: {
    type: Boolean,
    default: false,
  },
});

module.exports = AdminSchema;
