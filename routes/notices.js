const express = require('express');
const noticesService = require('../services/noticesService');
const router = express.Router();
const logger = require('../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    const results = await noticesService.getNoticeList();

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
