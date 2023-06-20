const dotEnv = require('dotenv');
dotEnv.config();

module.exports = {
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_ACCESS_SECRET_KEY: process.env.AWS_ACCESS_SECRET_KEY,
  REGION: process.env.REGION,
  S3_BUCKET: process.env.S3_BUCKET,
};
