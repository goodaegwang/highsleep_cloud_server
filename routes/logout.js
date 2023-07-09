const express = require('express');
const router = express.Router();
const logger = require('../common/logger')(__filename);
const logoutService = require('../services/logoutService');

router.post('/', async (req, res, next) => {
  try {
    await logoutService.logout(req.tokenInfo.userId);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
