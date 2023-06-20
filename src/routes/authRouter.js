const { Router } = require('express');
const router = Router();
const tokenValidator = require('../validator/jwt/tokenValidator');
const authController = require('../controllers/authController');

//[ 회원가입 ]
router.post('/signup', authController.signUp);

// [ 로그인 ]
router.post('/login', authController.logIn);

//[회원가입 아이디 중복체크]
router.post('/id', authController.validateUniqueUserId);

// [ 비밀번호 체크 ]
router.post('/password', authController.validatePassword);

//[ 로그아웃 ]
router.delete('/logout', tokenValidator, authController.logOut);

module.exports = router;
