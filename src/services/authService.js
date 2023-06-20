const { User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const hashPassword = require('../utils/hashPassword');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = require('../envconfig');

//[ 유저 회원가입 ]
/** (유저 입력 formdata) */
const signUp = async (formData) => {
  const { user_id, password, name, nick_name, email, phone_number, gender } =
    formData;

  try {
    const foundUserId = await User.findOne({ user_id });

    if (foundUserId) return new AppError(400, '이미 존재하는 아이디입니다.');

    const foundUserEmail = await User.findOne({ email });

    if (foundUserEmail) {
      return new AppError(400, '이미 존재하는 이메일입니다.');
    }

    const foundUserNickName = await User.findOne({ nick_name });
    if (foundUserNickName) {
      return new AppError(400, '이미 존재하는 닉네임입니다.');
    }

    const hashedPassword = await hashPassword(password);

    const addUser = await User.create({
      user_id,
      password: hashedPassword,
      name,
      nick_name,
      email,
      phone_number,
      gender,
    });

    await addUser.save();

    return { statusCode: 201, message: '회원가입에 성공하였습니다.' };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

//[유저 로그인]
/** (아이디, 패스워드)*/
const logIn = async (user_id, password) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) {
      return new AppError(404, '존재하지 않는 아이디입니다.');
    }

    const isMatched = await bcrypt.compare(password, foundUser.password);

    if (!isMatched) {
      return new AppError(400, '비밀번호가 일치하지 않습니다.');
    }

    if (foundUser.login_banned) {
      const { login_banEndDate } = foundUser;
      const currentDate = new Date();

      if (login_banEndDate && login_banEndDate <= currentDate) {
        foundUser.login_banned = false;
        foundUser.login_banEndDate = null;

        await foundUser.save();
      } else {
        const dateString = login_banEndDate.toString();
        const newDate = new Date(dateString);

        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          weekday: 'long',
          timeZoneName: 'long',
        };

        const dateFormatter = new Intl.DateTimeFormat('ko-KR', options);
        const translatedDate = dateFormatter.format(newDate);

        const [year, month, date, day, type, hour, minute] =
          translatedDate.split(' ');

        return new AppError(
          403,
          `${year} ${month} ${date} ${day} ${type} ${hour} ${minute} 까지 로그인 정지입니다.`
        );
      }
    }

    const payload = {
      user_id: foundUser.user_id,
      password: foundUser.password,
    };

    //[accessToken 생성]
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    //[refreshToken 생성]
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    console.log(foundUser);
    return {
      statusCode: 200,
      message: '로그인 성공',
      accessToken,
      refreshToken,
      data: {
        user_id: foundUser.user_id,
        name: foundUser.name,
        nick_name: foundUser.nick_name,
        email: foundUser.email,
        phone_number: foundUser.phone_number,
        role: foundUser.role,
        applicant_status: foundUser.applicant_status,
        gender: foundUser.gender,
        profile: foundUser.profile,
        favoritePlaygrounds: foundUser.favoritePlaygrounds,
        login_banned: foundUser.login_banned,
        login_banEndDate: foundUser.login_banEndDate,
        community_banned: foundUser.community_banned,
        community_banEndData: foundUser.community_banEndDate,
        createdAt: foundUser.createdAt,
      },
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 유저 로그아웃 ]
const logOut = async (req, res) => {
  try {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    return { statusCode: 200, message: '로그아웃 완료' };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

//[ 회원가입 아이디 중복 체크 ]
const validateUniqueUserId = async (user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (foundUser) return new AppError(400, '이미 존재하는 아이디입니다.');

    return { statusCode: 200, message: '사용할 수 있는 아이디입니다!' };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

//[비밀번호 체크]
const validatePassword = async (user_id, password) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) {
      return new AppError(404, '존재하지 않는 아이디입니다.');
    }

    const isMatched = await bcrypt.compare(password, foundUser.password);

    if (!isMatched) {
      return new AppError(400, '비밀번호가 일치하지 않습니다.');
    }

    return { statusCode: 200, message: '비밀번호가 확인되었습니다.' };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

module.exports = {
  logIn,
  signUp,
  logOut,
  validateUniqueUserId,
  validatePassword,
};
