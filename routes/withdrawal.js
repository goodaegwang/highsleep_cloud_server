const express = require('express');
const withdrawalService = require('../services/withdrawalService');
const router = express.Router();
const logger = require('../common/logger')(__filename);

router.post('/', async (req, res, next) => {
  try {
    await withdrawalService.withdrawal(req.userId);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
