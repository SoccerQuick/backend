class AppError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  console.log(statusCode, message);
  res.status(statusCode || 500).json({
    status: 'error',
    statusCode: statusCode || 500,
    message: message || '서버 에러 입니다.',
  });
};

//[ Joi 유효성 검사 에러 메시지 헨들러 ]
/** (Joi 에러 객체) */
const errorMessageHandler = (error, value) => {
  const { type, context } = error.details[0];
  const errorLabel = context.label;
  console.log(type);
  console.log(context);
  console.log(errorLabel);
  console.log(value);
  switch (type) {
    case 'any.required': {
      return `${errorLabel}는 필수 입력 사항입니다.`;
    }
    case 'string.min': {
      return `${errorLabel}은 2글자 이상이여야 합니다. `;
    }
    case 'string.max': {
      return `${errorLabel}은 10글자 이하여야 합니다.`;
    }
    case 'string.empty': {
      return `${errorLabel}을(를) 입력해주세요.`;
    }
    case 'string.pattern.base': {
      switch (errorLabel) {
        case '비밀번호': {
          return `비밀번호는 8~16자 영문, 숫자로 입력해주세요.`;
        }
        case '이름': {
          return `이름은 한글로 입력해주세요.`;
        }
        case '닉네임': {
          return `닉네임은 글자 단위의 한글, 영어 대소문자, 숫자로만 입력해주세요.`;
        }
        case '이메일': {
          return `이메일 형식을 다시 한 번 확인해주세요.`;
        }
        case '연락처': {
          return `연락처 형식 예시) 01012345678`;
        }
      }
      return `${errorLabel} 형식을 다시 한 번 확인해주세요.`;
    }

    case 'string.email': {
      return `${errorLabel} 형식이 올바르지 않습니다.`;
    }
    case 'string.alphanum': {
      return `${errorLabel}는 영어와 숫자로만 이루어져야 합니다.`;
    }
    default: {
      return '입력하신 정보를 다시 한 번 확인해주세요.';
    }
  }
};

module.exports = {
  AppError,
  errorHandler,
  errorMessageHandler,
};
