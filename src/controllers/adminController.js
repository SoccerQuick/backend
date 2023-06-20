const adminService = require('../services/adminService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const {
  getAllUserInfoSchema,
  adminBanSchema,
  updateUserRoleSchema,
} = require('../validator/adminValidator');

// [ 관리자 ] 유저 전체 정보 조회
const getAllUserInfo = async (req, res, next) => {
  const { user_id } = req.user;

  const { error } = getAllUserInfoSchema.validate({ user_id });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } = await adminService.getAllUserInfo(
      user_id
    );

    if (statusCode !== 200) return next(new AppError(statusCode, message));

    res.status(200).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 관리자 ] 유저 로그인 정지
const adminBanUser = async (req, res, next) => {
  const { user_id } = req.user;
  const { banUserId } = req.body;

  const { error } = adminBanSchema.validate({ user_id, banUserId });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message } = await adminService.banUser(
      user_id,
      banUserId
    );

    if (statusCode !== 200) return next(new AppError(statusCode, message));

    res.status(200).json({
      message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 관리자 ] 유저 커뮤니티 정지
const adminBanCommunity = async (req, res, next) => {
  const { user_id } = req.user;
  const { banUserId } = req.body;

  const { error } = adminBanSchema.validate({ user_id, banUserId });

  //안 바꾼 부분
  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message } = await adminService.banCommunity(
      user_id,
      banUserId
    );

    if (statusCode !== 200) return next(new AppError(statusCode, message));

    res.status(200).json({
      message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 관리자 ] 일반 유저 직위 변경 user -> manager
const updateUserRole = async (req, res, next) => {
  const { user_id } = req.user;
  const { updateUser } = req.body;

  const { error } = updateUserRoleSchema.validate({ user_id, updateUser });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message } = await adminService.updateUserRole(
      user_id,
      updateUser
    );

    if (statusCode !== 200) return next(new AppError(statusCode, message));

    res.status(200).json({
      message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

module.exports = {
  getAllUserInfo,
  adminBanUser,
  updateUserRole,
  adminBanCommunity,
};
