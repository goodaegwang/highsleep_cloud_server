const express = require('express');
const config = require('config');
const router = express.Router();
const createHttpError = require('http-errors');
const logger = require('../common/logger')(__filename);
const commonUtil = require('../common/commonUtil');
const joinService = require('../services/joinService');

router.post('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.userId)) {
      next(createHttpError(400, { message: 'userId is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.name)) {
      next(createHttpError(400, { message: 'name is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.phone)) {
      next(createHttpError(400, { message: 'phone is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.birthday)) {
      next(createHttpError(400, { message: 'birthday is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.password)) {
      next(createHttpError(400, { message: 'password is missing.' }));
      return;
    }

    const { name, userId, phone, birthday, password } = req.body;

    const isDuplicate = await joinService.isIdDuplicate(userId);

    if (isDuplicate) {
      next(createHttpError(400, { message: 'duplicate userId' }));
      return;
    }

    await joinService.join(name, userId, 'inApp', phone, birthday, password);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/message', async (req, res, next) => {
  try {
    const result = await commonUtil.sendSMS(req.body.phone);

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
