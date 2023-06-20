const { Router } = require('express');
const router = Router();
const tokenValidator = require('../validator/jwt/tokenValidator');
const domController = require('../controllers/domController');

// [ 검색된 풋볼장 조회 ]
router.get('/search', tokenValidator, domController.getSearchLocation);

// [ 모든 풋볼장 조회 ]
router.get('/', tokenValidator, domController.getAllDoms);

// [ 단일 풋볼장 조회 ]
router.get('/:domId', domController.getOneDom);

// [ 풋볼장 즐겨찾기에 추가 ]
router.post('/', tokenValidator, domController.addFavoriteDoms);

// [ 풋볼장 즐겨찾기에서 삭제]
router.delete('/:domId', tokenValidator, domController.removeFavoriteDoms);

module.exports = router;
