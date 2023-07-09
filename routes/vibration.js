const express = require('express');
const createHttpError = require('http-errors');
const commonUtil = require('../common/commonUtil');
const router = express.Router();
const vibrationService = require('../services/vibrationService');
const logger = require('../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    const vibrationInfo = await vibrationService.getVibration(req.userId);

    res.status(200);
    next({ vibrationInfo });
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.vibration)) {
      next(createHttpError(400, { message: 'vibration is missing.' }));
      return;
    }
    const result = await vibrationService.getVibration(req.userId);

    if (result.length === 0) {
      await vibrationService.addVibration(req.userId, req.body.vibration);
    } else {
      await vibrationService.updateVibration(req.userId, req.body.vibration);
    }

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
