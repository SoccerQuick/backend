const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cron = require('node-cron');
const deleteExpiredWithdrawnUsers = require('./utils/deleteExpiredWithdrawnUsers');
const { connectToDatabase } = require('./database/db');
const { PORT, DB_HOST, DB_NAME } = require('./envconfig');
const { errorHandler } = require('./middlewares/errorHandler');

//api
// const { createFutsal } = require('./api/data');
// createFutsal();

//router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const communityRouter = require('./routes/communityRouter');
const domRouter = require('./routes/domRouter');
const reviewRouter = require('./routes/reviewRouter');
const groupRouter = require('./routes/groupRouter');

const origins = [
  'http://localhost:8800',
  'http://localhost:3000',
  'http://kdt-sw-4-team02.elicecoding.com',
];
const corsOptions = {
  origin: origins,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('uploads'));

connectToDatabase()
  .then(async () => {
    cron.schedule('0 0 * * *', async () => {
      console.log('탈퇴 후 6개월 지난 회원들을 삭제중입니다..');
      await deleteExpiredWithdrawnUsers();
    });
    app.use('/', indexRouter);
    app.listen(PORT, () => {
      console.log('PORT:', PORT);
      console.log('DB_HOST:', DB_HOST);
      console.log('DB_NAME:', DB_NAME);
      console.log(`SERVER IS RUNNING ON PORT:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.use('/api/v1/auths', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/communities', communityRouter);
app.use('/api/v1/doms', domRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/groups', groupRouter);
app.use(errorHandler);
