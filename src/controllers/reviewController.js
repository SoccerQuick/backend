const reviewService = require('../services/reviewService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');

const {
  addReviewSchema,
  updateReviewSchema,
  deleteReviewSchema,
} = require('../validator/reviewValidator');

// [ 리뷰 전체 조회 ]
const getAllReviews = async (req, res, next) => {
  try {
    const { statusCode, message, data } = await reviewService.getAllReviews();

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

// [ 리뷰 상세 조회 ]
const getOneReview = async (req, res, next) => {
  const { reviewId } = req.params;
  try {
    const { statusCode, message, data } = await reviewService.getOneReview(
      reviewId
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

// [ 리뷰 페이징 조회 ]
const getPageReview = async (req, res, next) => {
  const { page } = req.query;

  try {
    const { statusCode, message, data } = await reviewService.getPageReview(
      page
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

// [ 리뷰 등록 ]
const addReview = async (req, res, next) => {
  const { user_id } = req.user;
  const { dom_id, contents } = req.body;

  const { error } = addReviewSchema.validate({
    user_id,
    dom_id,
    contents,
  });
  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } = await reviewService.addReview({
      user_id,
      dom_id,
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

// [ 리뷰 수정 ]
const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { user_id } = req.user;
  const { domId, contents } = req.body;

  const { error } = updateReviewSchema.validate({
    reviewId,
    user_id,
    domId,
    contents,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } = await reviewService.updateReview({
      reviewId,
      user_id,
      domId,
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

// [ 리뷰 삭제 ]
const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { user_id } = req.user;
  const { domId } = req.body;

  const { error } = deleteReviewSchema.validate({
    reviewId,
    user_id,
    domId,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message } = await reviewService.deleteReview(
      reviewId,
      user_id,
      domId
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

// [ 리뷰 좋아요 등록 ]
const addLikesReview = async (req, res, next) => {
  const { reviewId } = req.body;
  const { user_id } = req.user;
  try {
    const { statusCode, message, data } = await reviewService.addLikesReview(
      reviewId,
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

// [ 리뷰 추천 삭제 ]
const removeLikesReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { user_id } = req.user;
  try {
    const { statusCode, message } = await reviewService.removeLikesReview(
      reviewId,
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
  getAllReviews,
  getOneReview,
  getPageReview,
  addReview,
  updateReview,
  deleteReview,
  addLikesReview,
  removeLikesReview,
};
