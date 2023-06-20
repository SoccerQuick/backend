const { Router } = require('express');
const router = Router();
const tokenValidator = require('../validator/jwt/tokenValidator');
const reviewController = require('../controllers/reviewController');

/* GET */

// [ 리뷰 조회 - 페이징 쿼리 ]
router.get('/pages', tokenValidator, reviewController.getPageReview);

// [ 리뷰 조회 ]
router.get('/', tokenValidator, reviewController.getAllReviews);

// [ 리뷰 상세 조회 ]
router.get('/:reviewId', tokenValidator, reviewController.getOneReview);

/* POST */
// [ 리뷰 생성 ]
router.post('/', tokenValidator, reviewController.addReview);

// [ 리뷰 좋아요 등록 ]
router.post('/likes', tokenValidator, reviewController.addLikesReview);

/* PATCH */
// [ 리뷰 수정 ]
router.patch('/:reviewId', tokenValidator, reviewController.updateReview);

/* DELETE */
// [ 리뷰 삭제 ]
router.delete('/:reviewId', tokenValidator, reviewController.deleteReview);

// [ 리뷰 좋아요 삭제 ]
router.delete(
  '/:reviewId/likes',
  tokenValidator,
  reviewController.removeLikesReview
);

module.exports = router;
