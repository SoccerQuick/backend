const { Review, User, Dom } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const { createReviewId } = require('../utils/createIndex');

// [ 리뷰 전체 조회 ]
const getAllReviews = async () => {
  try {
    const reviews = await Review.find();

    if (!reviews) return new AppError(404, '등록된 리뷰가 존재하지 않습니다!');

    return {
      statusCode: 200,
      message: '전체 리뷰 조회 성공',
      data: reviews,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 리뷰 상세 조회 ]
const getOneReview = async (reviewId) => {
  try {
    const foundReview = await Review.findOne({ review_id: reviewId });
    if (!foundReview)
      return new AppError(404, '해당 리뷰가 존재하지 않습니다.');
    return { statusCode: 200, message: '리뷰 조회 성공', data: foundReview };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 리뷰 페이징 조회 ]
const getPageReview = async (pageGroup) => {
  try {
    const pageSize = 10;
    const skip = (pageGroup - 1) * pageSize;

    const foundReview = await Review.find().skip(skip).limit(pageSize);

    if (!foundReview)
      return new AppError(404, '현재 페이지에 존재하는 리뷰가 없습니다.');

    return { statusCode: 200, message: '리뷰 조회 성공', data: foundReview };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 리뷰 등록 ]
/** ([유저아이디, 풋볼장번호, 작성자이름, 평점, 리뷰내용 ]) */
const addReview = async (reviews) => {
  const { user_id, dom_id, contents } = reviews;

  try {
    const foundUser = await User.findOne({ user_id });
    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');
    const userObjectId = foundUser._id;
    const userName = foundUser.name;
    const userIcon = foundUser.profile;

    const foundDom = await Dom.findOne({ dom_id });
    if (!foundDom) return new AppError(404, '존재하지 않는 풋볼장입니다.');

    const domObjectId = foundDom._id;

    const reviewId = await createReviewId();

    const newReviewField = {
      review_id: reviewId,
      user_id: userObjectId,
      dom_id: domObjectId,
      ground_id: dom_id,
      name: foundUser.name,
      contents,
    };

    const newReview = await Review.create(newReviewField);

    const updatedDomReview = {
      review_id: newReview.review_id,
      dom_id: newReview.dom_id,
      ground_id: newReview.ground_id,
      contents: newReview.contents,
      user_name: userName,
      likedreviews: newReview.userslikes,
      user_icon: userIcon,
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt,
    };

    foundDom.reviews.push(updatedDomReview);

    await foundDom.save();

    console.log(foundDom.reviews);
    return {
      statusCode: 201,
      message: '리뷰가 등록되었습니다.',
      data: newReview,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 리뷰 수정 ]
/** ([리뷰번호, 유저아이디, 평점, 리뷰내용 ]) */
const updateReview = async (review) => {
  const { reviewId, user_id, domId, contents } = review;

  try {
    const foundReview = await Review.findOne({ review_id: reviewId });
    if (!foundReview) return new AppError(404, '존재하지 않는 리뷰입니다.');

    const foundUser = await User.findOne({ user_id });
    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');
    const userObjectId = toString(foundUser._id);

    if (toString(user_id) !== userObjectId) {
      return new AppError(404, '본인이 작성한 리뷰만 수정 가능합니다.');
    }

    const updatedReviewObj = {
      contents,
    };

    const updatedReview = await Review.findOneAndUpdate(
      { review_id: reviewId },
      { $set: updatedReviewObj },
      { new: true }
    );

    const foundDom = await Dom.findOne({ dom_id: domId });
    if (!foundDom) return new AppError(404, '구장 정보를 찾을 수 없습니다.');

    foundDom.reviews.forEach((review) => {
      const { review_id } = review;

      if (reviewId === review_id) {
        review.contents = contents;
        review.updatedAt = updatedReview.updatedAt;
      }
    });

    await foundDom.save();

    return { statusCode: 200, message: '리뷰 수정 성공', data: updatedReview };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 리뷰 삭제 ]
const deleteReview = async (reviewId, user_id, domId) => {
  try {
    const foundReview = await Review.findOne({ review_id: reviewId });

    if (!foundReview) return new AppError(404, '존재하지 않는 리뷰입니다.');

    const reviewUserObjectId = foundReview.user_id.toString();

    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');

    const userObjectId = foundUser._id.toString();

    if (reviewUserObjectId !== userObjectId)
      return new AppError(403, '리뷰 작성자만 삭제 가능합니다.');

    const foundDom = await Dom.findOne({ dom_id: domId });
    if (!foundDom) return new AppError(404, '구장 정보를 찾을 수 없습니다.');

    [...foundDom.reviews].forEach((review, idx) => {
      const { review_id } = review;

      if (reviewId === review_id) foundDom.reviews.splice(idx, 1);
    });

    await foundDom.save();

    await Review.deleteOne({ review_id: reviewId });

    return { statusCode: 204, message: '리뷰 삭제 성공' };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 리뷰 추천 ]
const addLikesReview = async (reviewId, user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });
    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');
    const userObjectId = foundUser._id.toString();

    const foundReview = await Review.findOne({ review_id: reviewId });
    if (!foundReview) return new AppError(404, '리뷰를 찾을 수 없습니다.');

    const domObjectId = foundReview.dom_id;
    const usersLikesArray = foundReview.userslikes;
    const filteredUsersReviews = usersLikesArray.filter(
      (user) => user._id.toString() === userObjectId
    );
    if (filteredUsersReviews.length > 0)
      return new AppError(400, '이미 리뷰에 추천되어 있습니다.');

    const foundDom = await Dom.findOne({ _id: domObjectId });
    if (!foundDom)
      return new AppError(404, '존재하지 않는 구장이거나 폐장된 구장입니다.');

    foundDom.reviews.forEach((review) => {
      if (review.review_id === reviewId) {
        const { likedreviews } = review;
        likedreviews.push(userObjectId);
      }
    });

    await foundDom.save();

    usersLikesArray.push({
      _id: userObjectId,
      user_id,
    });
    foundReview.userslikes = usersLikesArray;
    await foundReview.save();

    return {
      statusCode: 200,
      message: '리뷰 추천 추가되었습니다.',
      data: foundReview,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// 리뷰 추천 삭제
const removeLikesReview = async (reviewId, user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');

    const userObjectId = foundUser._id.toString();

    const foundReview = await Review.findOne({ review_id: reviewId });
    if (!foundReview) return new AppError(404, '존재하지 않는 리뷰 입니다.');

    const domObjectId = foundReview.dom_id;
    const usersLikesArray = foundReview.userslikes;

    const filteredUsersReviews = usersLikesArray.filter(
      (user) => user._id.toString() !== userObjectId
    );

    if (usersLikesArray.length === filteredUsersReviews.length)
      return new AppError(400, '이미 추천 해제된 리뷰입니다.');

    [...usersLikesArray].forEach((user, idx) => {
      if (user._id.toString() === userObjectId) usersLikesArray.splice(idx, 1);
    });

    const foundDom = await Dom.findOne({ _id: domObjectId });
    if (!foundDom)
      return new AppError(404, '존재하지 않는 구장이거나 폐지된 구장입니다.');

    foundDom.reviews.forEach((review) => {
      const { likedreviews } = review;
      [...likedreviews].forEach((user, idx) => {
        if (user.toString() === userObjectId) {
          likedreviews.splice(idx, 1);
        }
      });
    });

    await foundDom.save();

    foundReview.userslikes = usersLikesArray;
    await foundReview.save();

    return {
      statusCode: 204,
      message: '리뷰 추천에서 삭제되었습니다.',
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
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
