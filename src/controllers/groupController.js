const groupService = require('../services/groupService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const {
  addGroupSchema,
  userApplicantGroupSchema,
  leaderApplicantSchema,
  updateMyGroupSchema,
} = require('../validator/groupValidator');

// [ 전체 팀 그룹 조회 ]
const getAllGroups = async (req, res, next) => {
  try {
    const { statusCode, message, data } = await groupService.getAllGroups();

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

// [ 단일 팀 조회 ]
const getOneGroup = async (req, res, next) => {
  const { groupId } = req.params;
  try {
    const { statusCode, message, data } = await groupService.getOneGroup(
      groupId
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

// [ 리더 정보 조회 ]
const getGroupLeader = async (req, res, next) => {
  const { groupId } = req.params;

  try {
    const { statusCode, message, data } = await groupService.getGroupLeader(
      groupId
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

//[ 리더 - 팀 정보 수정 ]
const updateMyGroup = async (req, res, next) => {
  const { groupId } = req.params;
  const { user_id } = req.user;
  const {
    location,
    status,
    gk_count,
    player_count,
    gk_current_count,
    player_current_count,
    title,
    contents,
  } = req.body;

  const { error } = updateMyGroupSchema.validate({
    groupId,
    user_id,
    location,
    status,
    gk_count,
    player_count,
    gk_current_count,
    player_current_count,
    title,
    contents,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } = await groupService.updateMyGroup({
      groupId,
      user_id,
      location,
      status,
      gk_count,
      player_count,
      gk_current_count,
      player_current_count,
      title,
      contents,
    });

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

// [ 팀 그룹 등록 ]
const addGroup = async (req, res, next) => {
  const leader_id = req.user.user_id;
  const {
    title,
    location,
    gk_count,
    player_count,
    gk_current_count,
    player_current_count,
    contents,
  } = req.body;

  const { error } = addGroupSchema.validate({
    title,
    leader_id,
    location,
    gk_count,
    player_count,
    gk_current_count,
    player_current_count,
    contents,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } = await groupService.addGroup({
      leader_id,
      location,
      gk_count,
      player_count,
      gk_current_count,
      player_current_count,
      title,
      contents,
    });

    if (statusCode !== 201) return next(new AppError(statusCode, message));

    res.status(201).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// 유저 - [ 팀 그룹 신청 ]
const userApplicantGroup = async (req, res, next) => {
  const { groupId } = req.params;
  const { user_id } = req.user;
  const { position, level, contents } = req.body;

  const { error } = userApplicantGroupSchema.validate({
    groupId,
    user_id,
    position,
    level,
    contents,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } = await groupService.userApplicantGroup(
      {
        groupId,
        user_id,
        position,
        level,
        contents,
      }
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

// [ 리더 ] - 유저 신청 수락
const leaderApplicantAccept = async (req, res, next) => {
  const { groupId } = req.params;
  const { user_id } = req.body;
  const leaderId = req.user.user_id;

  const { error } = leaderApplicantSchema.validate({
    groupId,
    leaderId,
    user_id,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } =
      await groupService.leaderApplicantAccept(groupId, leaderId, user_id);

    if (statusCode !== 200) {
      return next(new AppError(statusCode, message));
    }

    res.status(200).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ 리더 ] - 유저 신청 거절
const leaderApplicantReject = async (req, res, next) => {
  const { groupId } = req.params;
  const { user_id } = req.body;
  const leaderId = req.user.user_id;

  const { error } = leaderApplicantSchema.validate({
    groupId,
    leaderId,
    user_id,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } =
      await groupService.leaderApplicantReject(groupId, leaderId, user_id);

    if (statusCode !== 200) {
      return next(new AppError(statusCode, message));
    }

    res.status(200).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ 리더, 관리자 ] - 팀 그룹 삭제
const deleteGroup = async (req, res, next) => {
  const { groupId } = req.params;
  const { user_id } = req.user;

  try {
    const { statusCode, message } = await groupService.deleteGroup(
      groupId,
      user_id
    );

    if (statusCode !== 204) return next(new AppError(statusCode, message));

    res.status(204).json({
      message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

module.exports = {
  getAllGroups,
  getOneGroup,
  getGroupLeader,
  updateMyGroup,
  addGroup,
  userApplicantGroup,
  leaderApplicantAccept,
  leaderApplicantReject,
  deleteGroup,
};
