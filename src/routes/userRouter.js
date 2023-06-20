const { Router } = require('express');
const router = Router();
const imageUpload = require('../middlewares/multer');
const tokenValidator = require('../validator/jwt/tokenValidator');
const userController = require('../controllers/userController');

// [ 유저 정보 조회 ] - 마이페이지
router.get('/', tokenValidator, userController.getUserInfo);

//[ 회원정보 수정 ]
router.patch(
  '/',
  tokenValidator,
  imageUpload.single('image'),
  userController.updateUserInfo
);

// [ 회원 탈퇴 ]
router.delete('/', tokenValidator, userController.deleteUserInfo);

module.exports = router;
