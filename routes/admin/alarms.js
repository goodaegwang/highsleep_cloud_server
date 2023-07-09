const express = require('express');
const router = express.Router();
const createHttpError = require('http-errors');
const commonUtil = require('../../common/commonUtil');
const ErrorCode = require('../../models/errorCode');
const alarmsService = require('../../services/alarmsService');
const logger = require('../../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.query.offset)) {
      next(createHttpError(400, { message: 'offset is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.query.limit)) {
      next(createHttpError(400, { message: 'limit is missing.' }));
      return;
    }
    if (req.query.searchText === undefined) {
      next(createHttpError(400, { message: 'searchText is missing.' }));
      return;
    }

    const results = await alarmsService.getAlarms(req.query.offset, req.query.limit, req.query.searchText);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/:alarmId', async (req, res, next) => {
  try {
    const result = await alarmsService.getAlarm(req.params.alarmId);

    res.status(200);
    next(result);
  } catch (err) {
    const is = new ErrorCode(err.message, next);
    if (!is.isNotFound) {
      logger.error(err);
      next(err);
    }
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.title)) {
      next(createHttpError(400, { message: 'title is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.content)) {
      next(createHttpError(400, { message: 'content is missing.' }));
      return;
    }

    await alarmsService.addAlarm(req.body.title, req.body.content);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.patch('/:alarmId', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.title)) {
      next(createHttpError(400, { message: 'title is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.content)) {
      next(createHttpError(400, { message: 'content is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.status)) {
      next(createHttpError(400, { message: 'status is missing.' }));
      return;
    }
    if (!(req.body.status == 'A' || req.body.status == 'D')) {
      next(createHttpError(400, { message: 'Wrong status type.' }));
      return;
    }

    await alarmsService.updateAlarm(req.params.alarmId, req.body.title, req.body.content, req.body.status);

    res.status(204);
    next({});
  } catch (err) {
    const is = new ErrorCode(err.message, next);
    if (!is.isNotFound) {
      logger.error(err);
      next(err);
    }
  }
});

router.delete('/:alarmId', async (req, res, next) => {
  try {
    await alarmsService.deleteAlarm(req.params.alarmId);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
