const { Router } = require('express');
const router = Router();
const tokenValidator = require('../validator/jwt/tokenValidator');
const adminController = require('../controllers/adminController');

// [ 관리자 - 전체 유저 정보 조회]
router.get('/', tokenValidator, adminController.getAllUserInfo);

//[ 관리자 - 유저 로그인 정지 ]
router.patch('/bans/login', tokenValidator, adminController.adminBanUser);

//[ 관리자 - 유저 게시물 등록 정지 ]
router.patch(
  '/bans/community',
  tokenValidator,
  adminController.adminBanCommunity
);

//[ 관리자 - 유저 직위 변경 ]
router.patch('/role', tokenValidator, adminController.updateUserRole);

module.exports = router;
