const { User, Admin } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const getBanTime = require('../utils/getBanTime');

// [ 관리자 ] 정보 조회
/** ( userId ) */
const getAllUserInfo = async (user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');
    if (!foundUser.admin_id)
      return new AppError(403, '관리자가 아닙니다. 접근 권한이 없습니다.');

    const foundAllUser = await User.find();
    const allUserData = foundAllUser.map((user) => {
      const {
        admin_id,
        user_id,
        name,
        nick_name,
        email,
        role,
        gender,
        phone_number,
        login_banned,
        community_banned,
      } = user;

      return {
        admin_id,
        user_id,
        name,
        nick_name,
        email,
        phone_number,
        role,
        gender,
        login_banned,
        community_banned,
        login_banEndDate: user.login_banEndDate,
        community_banEndDate: user.community_banEndDate,
        createdAt: user.createdAt,
      };
    });
    return {
      statusCode: 200,
      message: '모든 유저 정보 조회 성공',
      data: allUserData,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 관리자 ] 유저 로그인 정지
/**(아이디, 유저 유형, 정지 대상 아이디) */
const banUser = async (user_id, banUserId) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser.admin_id)
      return new AppError(403, '관리자 권한이 없습니다.');

    const foundBanUser = await User.findOne({ user_id: banUserId });

    if (!foundBanUser)
      return new AppError(404, '존재하지 않는 유저입니다. 다시 선택해 주세요.');

    if (foundBanUser.admin_id)
      return new AppError(
        400,
        '총 관리자 및 매니저는 서로 정지 시킬 수 없습니다.'
      );

    if (foundBanUser) {
      const currentDate = new Date();

      foundBanUser.login_banned = true;
      foundBanUser.login_banEndDate = getBanTime(currentDate, 2000); // 시간 1000 단위, 1000당 1일

      await foundBanUser.save();

      return { statusCode: 200, message: '로그인 정지 성공' };
    }
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 관리자 ] 유저 커뮤니티 정지
/**(아이디, 유저 유형, 정지 대상 아이디) */
const banCommunity = async (user_id, banUserId) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser.admin_id)
      return new AppError(403, '관리자 권한이 없습니다.');

    const foundBanUser = await User.findOne({ user_id: banUserId });

    if (!foundBanUser)
      return new AppError(404, '존재하지 않는 유저입니다. 다시 선택해 주세요.');

    if (foundBanUser.admin_id)
      return new AppError(
        400,
        '총 관리자 및 매니저는 서로 정지 시킬 수 없습니다.'
      );

    if (foundBanUser) {
      const currentDate = new Date();

      foundBanUser.community_banned = true;
      foundBanUser.community_banEndDate = getBanTime(currentDate, 2000); // 시간 1000 단위, 1000당 1일

      await foundBanUser.save();

      return { statusCode: 200, message: '커뮤니티 정지 성공' };
    }
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 관리자 ] 일반 유저 직위 변경 user -> manager
/** (관리자 아이디, 아이디의 직위, 직위변경하려고 하는 유저의 아이디) */
const updateUserRole = async (user_id, updateUser) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');
    if (!foundUser.admin_id) return new AppError(403, '권한이 없습니다.');

    const foundAdmin = await Admin.findOne({ _id: foundUser.admin_id });

    if (!foundAdmin.role) return new AppError(403, '권한이 없습니다.');

    const foundUpdateUser = await User.findOne({ user_id: updateUser });

    if (!foundUpdateUser) return new AppError(404, '유저를 찾을 수 없습니다.');
    if (foundUpdateUser.admin_id)
      return new AppError(400, '이미 관리자 권한이 있습니다.');

    const newAdmin = await Admin.create({
      user_id: foundUpdateUser._id,
      role: false,
      create_notice: true,
      suspend_user_login: true,
      suspend_posting: true,
      suspend_recruitment: true,
      force_withdrawal: true,
    });

    const newAdmin_id = newAdmin._id;

    foundUpdateUser.admin_id = newAdmin_id;
    foundUpdateUser.role = 'manager';

    await foundUpdateUser.save();

    return { statusCode: 200, message: '유저 직위 변경 성공' };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

module.exports = { getAllUserInfo, banUser, banCommunity, updateUserRole };
