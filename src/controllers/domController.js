const domService = require('../services/domService');
const { AppError } = require('../middlewares/errorHandler');

// [ 전체 구장 조회 ]
const getAllDoms = async (req, res, next) => {
  try {
    const { statusCode, message, data } = await domService.getAllDoms();
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

// [ 단일 구장 조회 ]
const getOneDom = async (req, res, next) => {
  const { domId } = req.params;

  try {
    const { statusCode, message, data } = await domService.getOneDom(domId);

    if (statusCode !== 200) return next(new AppError(statusCode, message));

    res.status(200).json({
      message,
      data,
    });
  } catch (error) {
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 검색된 위치의 풋볼장 찾기 ]
const getSearchLocation = async (req, res, next) => {
  const { keywords } = req.query;

  try {
    const { statusCode, message, data } = await domService.getSearchLocation(
      keywords
    );

    if (statusCode !== 200) return new AppError(statusCode, message);

    res.status(200).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 풋볼장 즐겨찾기 추가 ]
const addFavoriteDoms = async (req, res, next) => {
  const { domId } = req.body;
  const { user_id } = req.user;

  try {
    const { statusCode, message, data } = await domService.addFavoriteDoms(
      domId,
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

// [ 풋볼장 즐겨찾기 삭제 ]
const removeFavoriteDoms = async (req, res, next) => {
  const { domId } = req.params;
  const { user_id } = req.user;

  try {
    const { statusCode, message } = await domService.removeFavoriteDoms(
      domId,
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
  getAllDoms,
  getOneDom,
  getSearchLocation,
  addFavoriteDoms,
  removeFavoriteDoms,
};
