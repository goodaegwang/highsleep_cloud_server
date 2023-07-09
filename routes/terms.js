const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const terms = '서비스 이용 약관 ...';
  const privacy = '개인정보 제3자 제공 ...';

  res.status(200);
  next({ terms, privacy });
});

module.exports = router;
