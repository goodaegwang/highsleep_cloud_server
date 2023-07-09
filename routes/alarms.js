const express = require('express');
const createHttpError = require('http-errors');
const router = express.Router();
const commonUtil = require('../common/commonUtil');
const alarmsService = require('../services/alarmsService');
const logger = require('../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    const results = await alarmsService.getAlarmsOfUser(req.userId);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/:alarmId', async (req, res, next) => {
  try {
    await alarmsService.deleteUserAlarm(req.userId, req.params.alarmId);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
