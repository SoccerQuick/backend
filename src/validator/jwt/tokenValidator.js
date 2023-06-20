const jwt = require('jsonwebtoken');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
} = require('../../envconfig');
const { AppError } = require('../../middlewares/errorHandler');
const { createGuestId } = require('../../utils/createIndex');

// [ 게스트 ] 유저, 유저 객체 발급.
const nextForGuest = async (req, next) => {
  req.user = {
    user_id: await createGuestId(),
    user_email: 'GUEST@gmail.com',
  };

  next();
};

//[ AccessToken 재발급 ]
const generateNewAccessToken = (decodedRefreshToken) => {
  const { user_id, password } = decodedRefreshToken;

  const payload = {
    user_id,
    password,
  };

  const newAccessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  return newAccessToken;
};

// [ refreshToekn 검증 ]
const refreshTokenValidator = (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) throw new AppError(401, 'jwt malformed');

    const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // RefreshToken 검증 완료 시 만료시간 검사
    if (decodedRefreshToken.exp >= Math.floor(Date.now() / 1000)) {
      const newAccessToken = generateNewAccessToken(decodedRefreshToken);

      res.cookie('accessToken', newAccessToken);
      req.user = {
        user_id: decodedRefreshToken.user_id,
      };
      return next();
    }

    throw new AppError(401, 'jwt expired');
  } catch (error) {
    if (error.message === 'jwt expired') {
      console.error(error);
      return next(new AppError(401, 'Token이 모두 만료되었습니다.'));
    }

    if (error.message === 'jwt malformed') {
      console.error(error);
      return next(new AppError(401, 'RefreshToken이 유효하지 않습니다.'));
    }

    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ accessToken 검증 ]

const accessTokenValidator = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    //Guest
    if (!accessToken && req.method === 'GET') return nextForGuest(req, next);

    if (!accessToken) throw new AppError(401, 'jwt malformed');

    //accessToken 검증
    const decodedAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    const currentTime = Math.floor(Date.now() / 1000);

    //accessToken 만료시간 검증.
    if (decodedAccessToken.exp >= currentTime) {
      req.user = {
        user_id: decodedAccessToken.user_id,
      };

      return next();
    }

    throw new AppError(401, 'jwt expired');
  } catch (error) {
    if (error.message === 'jwt expired') {
      console.error(error);
      // AccessToken 만료 시 재발급 함수 호출
      return refreshTokenValidator(req, res, next);
    }

    if (error.message === 'jwt malformed') {
      console.error(error);
      return next(new AppError(401, 'AccessToken이 유효하지 않습니다.'));
    }

    return next(new AppError(500, 'Internal Server Error'));
  }
};

module.exports = accessTokenValidator;
