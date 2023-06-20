const { Dom, User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const toString = require('../utils/toString');

// [ 전체 풋볼장 조회 ]
const getAllDoms = async () => {
  try {
    const doms = await Dom.find();
    return {
      statusCode: 200,
      message: '전체 풋볼장 조회 성공',
      data: doms,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 단일 구장 조회 ]
const getOneDom = async (domId) => {
  try {
    const foundDom = await Dom.findOne({ dom_id: domId });
    if (!foundDom) return new AppError(404, '존재하지 않는 구장입니다.');

    return {
      statusCode: 200,
      message: '풋볼장 조회 성공',
      data: foundDom,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 검색된 지역의 구장 데이터 조회 ]
const getSearchLocation = async (keywords) => {
  try {
    const foundDom = await Dom.find();
    const filteredLocation = foundDom.filter((dom) => {
      const { fullAddress } = dom.address;

      return fullAddress.includes(keywords);
    });

    return {
      statusCode: 200,
      message: '검색결과 조회 성공',
      data: filteredLocation,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 풋볼장 즐겨찾기에 추가 ]
const addFavoriteDoms = async (domId, user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');

    const userObjectId = foundUser._id.toString();

    const foundDom = await Dom.findOne({ dom_id: domId });

    if (!foundDom) return new AppError(404, '풋볼장을 찾을 수 없습니다.');

    const usersFavoritesArray = foundDom.usersFavorites;

    const filteredUsersFavorites = usersFavoritesArray.filter(
      (user) => user.toString() === userObjectId
    );

    if (filteredUsersFavorites.length > 0)
      return new AppError(400, '이미 즐겨찾기에 추가 되어있습니다.');

    // 즐겨찾기에 추가
    usersFavoritesArray.push(userObjectId);

    foundDom.usersFavorites = usersFavoritesArray;

    await foundDom.save();

    foundUser.favoritePlaygrounds.push(foundDom.dom_id);

    await foundUser.save();

    return {
      statusCode: 200,
      message: '즐겨찾기에 추가되었습니다.',
      data: foundDom,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 풋볼장 즐겨찾기에서 삭제 ]
const removeFavoriteDoms = async (domId, user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');

    const userObjectId = foundUser._id.toString();

    const foundDom = await Dom.findOne({ dom_id: domId });
    if (!foundDom) return new AppError(404, '존재하지 않는 구장 입니다.');

    const usersFavoritesArray = foundDom.usersFavorites;

    const filteredUsersFavorites = usersFavoritesArray.filter(
      (user) => user.toString() !== userObjectId
    );

    if (usersFavoritesArray.length === filteredUsersFavorites.length)
      return new AppError(400, '즐겨찾기에 추가되어 있지 않습니다.');

    [...usersFavoritesArray].forEach((user, idx) => {
      if (user.toString() === userObjectId) usersFavoritesArray.splice(idx, 1);
    });

    foundDom.usersFavorites = usersFavoritesArray;
    await foundDom.save();

    return {
      statusCode: 204,
      message: '즐겨찾기에서 삭제되었습니다.',
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

module.exports = {
  getAllDoms,
  getOneDom,
  addFavoriteDoms,
  removeFavoriteDoms,
  getSearchLocation,
};
