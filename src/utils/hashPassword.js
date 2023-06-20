//[ 비밀번호 해싱 ]
const { BCRYPT_SALT_ROUNDS } = require('../envconfig');
const bcrypt = require('bcrypt');

/** 패스워드 */
const hashPassword = async (password) => {
  const saltRounds = parseInt(BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

module.exports = hashPassword;
