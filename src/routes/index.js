const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.send(
    '<h1 style="width: 100%; background: lightgray; margin: 0; padding: 0; text-align: center;">루트 페이지입니다 ㅎㅎ</h1>',
  );
});

module.exports = router;
