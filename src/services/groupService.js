const { Group, User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const { createGroupId } = require('../utils/createIndex');
const toString = require('../utils/toString');

// [ 전체 팀 그룹 조회 ]
const getAllGroups = async () => {
  try {
    const foundGroup = await Group.find();

    if (!foundGroup)
      return new AppError(404, '등록된 팀 그룹이 존재하지 않습니다.');

    const formattedGroups = foundGroup.map((group) => ({
      group_id: group.group_id,
      title: group.title,
      leader_id: group.leader.leader_id,
      leader_name: group.leader.leader_name,
      contents: group.contents,
      location: group.location,
      status: group.status,
      gk_count: group.recruitment_count.gk_count,
      player_count: group.recruitment_count.player_count,
      gk_current_count: group.recruitment_count.gk_current_count,
      player_current_count: group.recruitment_count.player_current_count,
      random_matched: group.random_matched,
      applicant: group.applicant,
      accept: group.accept,
    }));

    return {
      statusCode: 200,
      message: '전체 팀 그룹 목록 조회 성공',
      data: formattedGroups,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

//[ 단일 팀 조회 ]
const getOneGroup = async (group_id) => {
  try {
    const foundGroup = await Group.findOne({ group_id });

    if (!foundGroup) return new AppError(404, '존재하지 않는 팀 그룹입니다.');

    const groupData = {
      group_id: foundGroup.group_id,
      title: foundGroup.title,
      leader_id: foundGroup.leader.leader_id,
      leader_name: foundGroup.leader.leader_name,
      contents: foundGroup.contents,
      location: foundGroup.location,
      status: foundGroup.status,
      gk_count: foundGroup.recruitment_count.gk_count,
      player_count: foundGroup.recruitment_count.player_count,
      gk_current_count: foundGroup.recruitment_count.gk_current_count,
      player_current_count: foundGroup.recruitment_count.player_current_count,
      random_matched: foundGroup.random_matched,
      applicant: foundGroup.applicant,
      accept: foundGroup.accept,
    };

    return { statusCode: 200, message: '팀 조회 성공', data: groupData };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 리더 정보 조회 ]
const getGroupLeader = async (groupId) => {
  try {
    const group = await Group.findOne({ group_id: groupId }).populate(
      'leader.leader_id'
    );
    const leader = group.leader.leader_id;
    return {
      statusCode: 200,
      message: '리더 정보 조회 성공',
      data: leader,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 리더 - 자기 팀 정보 수정 ]
const updateMyGroup = async (myGroup) => {
  const {
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
  } = myGroup;

  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(404, '존재하지 않는 사용자 입니다.');

    const userObjectId = toString(foundUser._id);

    const foundGroup = await Group.findOne({ group_id: groupId });

    if (!foundGroup) return new AppError(404, '존재하지 않는 팀 그룹입니다.');

    const leaderObjectId = toString(foundGroup.leader.leader_id);

    if (userObjectId !== leaderObjectId)
      return new AppError(403, ' 팀 리더만 수정 가능합니다.');

    const newGroupData = {
      location,
      status,
      recruitment_count: {
        gk_count,
        player_count,
        gk_current_count,
        player_current_count,
      },
      title,
      contents,
    };

    const newGroup = await Group.findOneAndUpdate(
      { group_id: groupId },
      { $set: newGroupData },
      { new: true }
    );

    const newGroupFormattedData = {
      group_id: newGroup.group_id,
      title: newGroup.title,
      leader_id: newGroup.leader.leader_id,
      leader_name: newGroup.leader.leader_name,
      contents: newGroup.contents,
      location: newGroup.location,
      status: newGroup.status,
      gk_count: newGroup.recruitment_count.gk_count,
      player_count: newGroup.recruitment_count.player_count,
      gk_current_count: newGroup.recruitment_count.gk_current_count,
      player_current_count: newGroup.recruitment_count.player_current_count,
      random_matched: newGroup.random_matched,
      applicant: newGroup.applicant,
      accept: newGroup.accept,
    };

    return {
      statusCode: 200,
      message: '팀 정보가 수정되었습니다.',
      data: newGroupFormattedData,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [팀 그룹 등록]
/** (그룹 데이터) */
const addGroup = async (group) => {
  const {
    title,
    leader_id,
    location,
    gk_count,
    player_count,
    gk_current_count,
    player_current_count,
    contents,
  } = group;

  try {
    const foundLeader = await User.findOne({ user_id: leader_id });

    if (!foundLeader) return new AppError(404, '존재하지 않는 아이디입니다.');

    const leaderObjectId = foundLeader._id;
    const leaderName = foundLeader.name;

    const groupId = await createGroupId();

    const groupData = {
      group_id: groupId,
      leader: {
        leader_id: leaderObjectId,
        leader_name: leaderName,
      },
      location: location,
      recruitment_count: {
        gk_count: Number(gk_count),
        player_count: Number(player_count),
        gk_current_count: Number(gk_current_count),
        player_current_count: Number(player_current_count),
      },
      title,
      contents,
    };

    const createGroup = await Group.create(groupData);

    const groupFormatData = {
      group_id: createGroup.group_id,
      title: createGroup.title,
      leader_id: createGroup.leader.leader_id,
      leader_name: createGroup.leader.leader_name,
      contents: createGroup.contents,
      location: createGroup.location,
      status: createGroup.status,
      gk_count: createGroup.recruitment_count.gk_count,
      player_count: createGroup.recruitment_count.player_count,
      gk_current_count: createGroup.recruitment_count.gk_current_count,
      player_current_count: createGroup.recruitment_count.player_current_count,
      random_matched: createGroup.random_matched,
      applicant: createGroup.applicant,
      accept: createGroup.accept,
    };

    return {
      statusCode: 201,
      message: '팀 등록이 완료되었습니다.',
      data: groupFormatData,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// 유저 - [ 팀 신청 ]
/** (신청 팀그룹 아이디, 유저 데이터) Object */
const userApplicantGroup = async (user) => {
  const { groupId, user_id, position, level, contents } = user;

  try {
    const foundUser = await User.findOne({ user_id });
    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');

    const userObjectId = foundUser._id;
    const userName = foundUser.name;
    const userGender = foundUser.gender;
    const userStatus = foundUser.applicant_status;

    const foundGroup = await Group.findOne({ group_id: groupId });
    if (!foundGroup) return new AppError(404, '존재하지 않는 팀 그룹입니다.');

    if (foundGroup.status === '모집 완료')
      return new AppError(403, '이미 모집이 완료 된 팀입니다.');

    const applicants = foundGroup.applicant;
    const acceptArray = foundGroup.accept;

    const filteredApplicant = [...applicants, ...acceptArray].filter(
      (user) => toString(user.id) === toString(userObjectId)
    );

    if (filteredApplicant.length > 0)
      return new AppError(400, '이미 신청한 팀 입니다.');

    if (userStatus === '모집 불가능')
      return new AppError(400, '이미 팀에 속해있습니다.');

    const applicantUserData = {
      id: userObjectId,
      name: userName,
      gender: userGender,
      position,
      level,
      contents,
      status: userStatus,
    };

    applicants.push(applicantUserData);

    await foundGroup.save();

    return { statusCode: 200, message: '팀 신청 완료', data: foundGroup };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 리더 ] - 유저 신청 수락
const leaderApplicantAccept = async (groupId, leaderId, user_id) => {
  try {
    const foundLeader = await User.findOne({ user_id: leaderId });
    if (!foundLeader)
      return new AppError(404, '존재하지 않는 리더 아이디입니다.');

    const foundGroup = await Group.findOne({ group_id: groupId });
    if (!foundGroup) return new AppError(404, '존재하지 않는 팀 그룹 입니다.');
    if (foundGroup.status === '모집 완료')
      return new AppError(400, '이미 모집 완료 되었습니다.');

    const foundUser = await User.findOne({ _id: user_id });
    if (!foundUser)
      return new AppError(404, '존재하지 않거나 탈퇴한 유저 입니다.');

    const leaderObjectId = toString(foundLeader._id);
    const userObjectId = toString(foundUser._id);
    const groupLeaderObjectId = toString(foundGroup.leader.leader_id);

    if (leaderObjectId !== groupLeaderObjectId)
      return new AppError(403, '팀 리더만 수락 가능합니다.');

    const applicants = foundGroup.applicant;
    const acceptArray = foundGroup.accept;

    let { gk_count, player_count, gk_current_count, player_current_count } =
      foundGroup.recruitment_count;

    //비동기 처리를 위한 for문
    let foundApplicantUser = false;
    for (let idx = 0; idx < applicants.length; idx++) {
      const user = applicants[idx];

      if (toString(user.id) === userObjectId) {
        if (user.status === '모집 불가능')
          throw new AppError(400, '이미 다른 팀에서 모집완료 되었습니다.');

        if (user.position === '골키퍼' && gk_count === 0)
          throw new AppError(400, '신청 가능한 골키퍼 포지션은 0 개 입니다!');

        if (user.position === '골키퍼' && gk_count > 0) {
          user.status = '모집 불가능';
          acceptArray.push(user);
          applicants.splice(idx, 1);
          gk_count -= 1;
          gk_current_count += 1;
        }

        if (user.position !== '골키퍼' && player_count === 0)
          throw new AppError(400, '신청 가능한 플레이어 포지션은 0 개 입니다!');

        if (user.position !== '골키퍼' && player_count > 0) {
          user.status = '모집 불가능';
          acceptArray.push(user);
          applicants.splice(idx, 1);
          player_count -= 1;
          player_current_count += 1;
        }

        foundUser.applicant_status = '모집 불가능';
        await foundUser.save();

        foundApplicantUser = true;
        break;
      }
    }

    if (!foundApplicantUser) {
      throw new AppError(
        404,
        '이미 수락되었거나 신청목록에 존재하지 않습니다.'
      );
    }

    //팀 모집 자동 종료
    if (gk_count === 0 && player_count === 0) foundGroup.status = '모집 완료';

    foundGroup.recruitment_count = {
      gk_count,
      player_count,
      gk_current_count,
      player_current_count,
    };

    await Group.updateOne(
      { _id: foundGroup._id, 'accept.id': userObjectId },
      { $set: { 'accept.$[elem].status': '모집 불가능' } },
      { arrayFilters: [{ 'elem.id': userObjectId }] }
    ).exec();

    await foundGroup.save();

    await Group.updateMany(
      { 'applicant.id': userObjectId },
      { $set: { 'applicant.$[elem].status': '모집 불가능' } },
      { arrayFilters: [{ 'elem.id': userObjectId }] }
    ).exec();

    const groupFormatData = {
      group_id: foundGroup.group_id,
      title: foundGroup.title,
      leader_id: foundGroup.leader.leader_id,
      leader_name: foundGroup.leader.leader_name,
      contents: foundGroup.contents,
      location: foundGroup.location,
      status: foundGroup.status,
      gk_count: foundGroup.recruitment_count.gk_count,
      player_count: foundGroup.recruitment_count.player_count,
      gk_current_count: foundGroup.recruitment_count.gk_current_count,
      player_current_count: foundGroup.recruitment_count.player_current_count,
      random_matched: foundGroup.random_matched,
      applicant: foundGroup.applicant,
      accept: foundGroup.accept,
    };

    return {
      statusCode: 200,
      message: '팀원 수락 성공',
      data: groupFormatData,
    };
  } catch (error) {
    if (error.statusCode !== 500) {
      return new AppError(error.statusCode, error.message);
    } else {
      return new AppError(500, 'Internal Server Error');
    }
  }
};

// [ 리더 ] - 유저 신청 거절
const leaderApplicantReject = async (groupId, leaderId, user_id) => {
  try {
    const foundLeader = await User.findOne({ user_id: leaderId });
    if (!foundLeader)
      return new AppError(404, '존재하지 않는 리더 아이디입니다.');

    const foundGroup = await Group.findOne({ group_id: groupId });
    if (!foundGroup) return new AppError(404, '존재하지 않는 팀 그룹 입니다.');

    const foundUser = await User.findOne({ _id: user_id });
    if (!foundUser)
      return new AppError(404, '존재하지 않거나 탈퇴한 유저 입니다.');

    const leaderObjectId = toString(foundLeader._id);
    const userObjectId = toString(foundUser._id);
    const groupLeaderObjectId = toString(foundGroup.leader.leader_id);

    if (leaderObjectId !== groupLeaderObjectId)
      return new AppError(403, '팀 리더만 거절 가능합니다.');

    const applicants = foundGroup.applicant;

    const filteredApplicants = applicants.filter(
      (user) => toString(user.id) !== userObjectId
    );

    if (filteredApplicants.length === applicants.length)
      return new AppError(404, '신청목록에 유저가 존재하지 않습니다.');

    foundGroup.applicant = filteredApplicants;

    await foundGroup.save();

    const groupFormatData = {
      group_id: foundGroup.group_id,
      title: foundGroup.title,
      leader_id: foundGroup.leader.leader_id,
      leader_name: foundGroup.leader.leader_name,
      contents: foundGroup.contents,
      location: foundGroup.location,
      status: foundGroup.status,
      gk_count: foundGroup.recruitment_count.gk_count,
      player_count: foundGroup.recruitment_count.player_count,
      gk_current_count: foundGroup.recruitment_count.gk_current_count,
      player_current_count: foundGroup.recruitment_count.player_current_count,
      random_matched: foundGroup.random_matched,
      applicant: foundGroup.applicant,
      accept: foundGroup.accept,
    };

    return {
      statusCode: 200,
      message: '팀원 거절 성공',
      data: groupFormatData,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 리더, 관리자 ] - 팀 그룹 삭제
const deleteGroup = async (groupId, user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });
    if (!foundUser) return new AppError(404, '존재하지 않는 사용자입니다.');

    const foundGroup = await Group.findOne({ group_id: groupId });
    if (!foundGroup) return new AppError(404, '존재하지 않는 팀 그룹입니다.');

    const userObjectId = toString(foundUser._id);
    const groupleaderObjectId = toString(foundGroup.leader.leader_id);

    if (foundUser.role === 'user' && userObjectId !== groupleaderObjectId)
      return new AppError(403, '팀 리더 및 관리자만 삭제 가능합니다.');

    const acceptArray = foundGroup.accept;

    for (idx = 0; idx < acceptArray.length; idx++) {
      const user = acceptArray[idx];
      const userObjectId = user.id;

      const foundUser = await User.findOne({ _id: userObjectId });
      if (!foundUser) continue;

      foundUser.applicant_status = '모집 가능';
      await foundUser.save();

      await Group.updateMany(
        { 'applicant.id': userObjectId },
        { $set: { 'applicant.$[elem].status': '모집 가능' } },
        { arrayFilters: [{ 'elem.id': userObjectId }] }
      ).exec();
    }

    await Group.deleteOne({ group_id: groupId });

    return { statusCode: 204, message: '팀 그룹이 삭제되었습니다.' };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
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
